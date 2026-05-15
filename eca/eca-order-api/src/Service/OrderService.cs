using System.Linq.Expressions;
using Azure.Core;
using EcaOrderApi.Common;
using EcaOrderApi.Contract;
using EcaOrderApi.Controller.Dto;
using EcaOrderApi.External;
using EcaOrderApi.Messaging;
using EcaOrderApi.Model;
using EcaOrderApi.Repository;
using EcaOrderApi.Repository.Entity;
using FS.Keycloak.RestApiClient.Api;
using FS.Keycloak.RestApiClient.Client;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;

namespace EcaOrderApi.Service
{
	public class OrderService : IOrderService
	{
		private readonly IOrderRepository _orderRepository;
		private readonly IProductServiceClient _productServiceClient;
		private readonly UsersApi _usersApi;
		private readonly IMessagePublisher _messagePublisher;

		public OrderService(IOrderRepository orderRepository, IProductServiceClient productServiceClient, UsersApi usersApi, IMessagePublisher messagePublisher)
		{
			_orderRepository = orderRepository;
			_productServiceClient = productServiceClient;
			_usersApi = usersApi;
			_messagePublisher = messagePublisher;
		}

		public async Task<Order> AddOrderAsync(Order order)
		{
			var keycloakRealm = Environment.GetEnvironmentVariable("KEYCLOAK_REALM")
					   ?? throw new Exception("KEYCLOAK_REALM not set in .env");
			try
			{
				var user = await _usersApi.GetUsersByUserIdAsync(keycloakRealm, order.UserId);
			}
			catch (ApiException e)
			{
				throw new NotFoundException("User", order.UserId);
			}


			var products = await _productServiceClient.GetProductsInAsync(order.Items.Select(i => i.ProductSku).ToList());
			var orderItems = products.Select(p =>
			{
				var quantity = order.Items.Find(i => i.ProductSku == p.Sku)?.Quantity ?? 0;
				return new OrderItemEntity
				{
					Quantity = quantity,
					ProductSku = p.Sku,
					UnitPriceCents = p.PriceCents
				};
			}).ToList();

			var orderEntity = new OrderEntity
			{
				Currency = order.Currency,
				Status = OrderStatus.AwaitingStock,
				PaymentStatus = "Pending",
				TotalCents = orderItems.Sum(i => i.Quantity * i.UnitPriceCents),
				UserId = order.UserId,
				Items = orderItems
			};

			var createdOrderEntity = await _orderRepository.AddOrderAsync(orderEntity);
			var message = new ReserveStockCommand
			{
				OrderId = createdOrderEntity.Id,
				Items = createdOrderEntity.Items.Select(i => new ReserveStockCommandItem
				{
					ProductSku = i.ProductSku!,
					Quantity = i.Quantity
				}).ToList()
			};
			await  _messagePublisher.PublishAsync("order.reserve.stock", message);

			return createdOrderEntity.ToModel();
		}

		public async Task<bool> DeleteOrderAsync(int id)
		{
			try
			{
				return await _orderRepository.DeleteOrderAsync(id);
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error deleting order: {ex.Message}");
				return false;
			}
		}

		public async Task<IEnumerable<Order>> GetAllOrdersAsync()
		{

			var orderEntities = await _orderRepository.GetAllOrdersAsync();
			return orderEntities.Select(e => e.ToModel());
		}

		public async Task<Order> GetOrderByIdAsync(int id)
		{
			try
			{
				var orderEntity = await _orderRepository.GetOrderByIdAsync(id);
				return orderEntity.ToModel();
			}
			catch (System.Exception e)
			{
				return null;
			}
		}
	
		public async Task ConfirmOrderAsync(int orderId)
		{
			Console.WriteLine($"Confirming order {orderId}");
			
			try
			{
				// Update order status to Paid
				var order = await _orderRepository.GetOrderByIdAsync(orderId);
				if (order == null)
				{
					Console.WriteLine($"Order {orderId} not found");
					throw new Exception($"Order {orderId} not found");
				}
				
				order.Status = OrderStatus.Paid;
				order.PaymentStatus = "Paid";
				await _orderRepository.UpdateOrderAsync(order);
				
				// Publish order.confirmed event to notify inventory service
				var confirmedEvent = new OrderConfirmedEvent
				{
					OrderId = orderId
				};
				await _messagePublisher.PublishAsync("order.confirmed", confirmedEvent);
				
				Console.WriteLine($"Order {orderId} confirmed and event published");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error confirming order {orderId}: {ex.Message}");
				throw;
			}
		}

		public async Task RejectOrderAsync(int orderId, string reason)
		{
			Console.WriteLine($"Rejecting order {orderId} - Reason: {reason}");
			
			// Update order status to Cancelled
			var order = await _orderRepository.GetOrderByIdAsync(orderId);
			order.Status = OrderStatus.Cancelled;
			await _orderRepository.UpdateOrderAsync(order);
			
			Console.WriteLine($"Order {orderId} cancelled");
		}

		public async Task SetAwaitingPaymentAsync(int orderId)
		{
			Console.WriteLine($"Setting order {orderId} to awaiting payment");
			
			var order = await _orderRepository.GetOrderByIdAsync(orderId);
			order.Status = OrderStatus.AwaitingPayment;
			await _orderRepository.UpdateOrderAsync(order);
			
			Console.WriteLine($"Order {orderId} is now awaiting payment");
		}
	}
}