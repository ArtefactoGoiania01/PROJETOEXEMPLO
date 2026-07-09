# syntax=docker/dockerfile:1

FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Mantém node_modules completo (com o CLI do Prisma) para permitir
# `prisma migrate deploy` no start do container em ambientes self-hosted.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads /app/.next

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
