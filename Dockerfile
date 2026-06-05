FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund


FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# OCI provenance metadata - GHCR links the image to source/license automatically
LABEL org.opencontainers.image.source="https://github.com/Dev2-PT-Gruppe-D/FHB-Assignment-Backend"
LABEL org.opencontainers.image.description="FHB DevOps Assignment - Notes Backend"
LABEL org.opencontainers.image.licenses="ISC"

COPY --from=builder /app/node_modules ./node_modules

COPY app.js index.js utils.js package.json ./

# Drop the npm CLI bundled in the base image - it is not used at runtime and its
# bundled deps (tar, minimatch, glob, cross-spawn) carry HIGH CVEs the Trivy gate flags
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

RUN chown -R node:node /app

EXPOSE 3001

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://localhost:3001/api/notes || exit 1

CMD ["node", "index.js"]
