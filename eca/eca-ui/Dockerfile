FROM oven/bun:latest AS build
RUN apt-get update && apt-get install -y --no-install-recommends nodejs && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:latest AS final
WORKDIR /app
COPY --from=build /app/dist/eca-ui ./dist/eca-ui
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 4000
CMD ["bun", "dist/eca-ui/server/server.mjs"]
