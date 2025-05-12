FROM node:18-alpine AS base

# Alpine needs python to run
RUN apk add --no-cache g++ make py3-pip libc6-compat

# Copy packages to workdir
WORKDIR /app
COPY package*.json ./
EXPOSE 3000


################
# Stage: Builder
################
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm ci --legacy-peer-deps
RUN npm run build


###################
# Stage: Production
###################
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Add user for security reasons
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Copy artefacts from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Start Next.js
CMD ["npm", "start"]

