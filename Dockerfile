FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund


FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY app.js index.js utils.js package.json ./

RUN chown -R node:node /app

EXPOSE 3001

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://localhost:3001/api/notes || exit 1

CMD ["node", "index.js"]
