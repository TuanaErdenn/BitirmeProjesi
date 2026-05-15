using System.Text.Json.Serialization;
using EcaOrderApi.Common;

namespace EcaOrderApi.Model
{
    [JsonConverter(typeof(SnakeCaseEnumJsonConverter<OrderStatus>))]
    public enum OrderStatus
    {
        New,
        AwaitingStock,
        AwaitingPayment,
        Paid,
        Cancelled,
        Fulfilled
    }
}