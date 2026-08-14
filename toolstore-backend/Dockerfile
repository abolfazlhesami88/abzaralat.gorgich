# Stage 1: Build the NestJS application
FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /usr/src/app/dist ./dist

# Create uploads directory and set permissions for node user
RUN mkdir -p uploads && chown -R node:node /usr/src/app/uploads

# Use non-root user for security
USER node

EXPOSE 3000
CMD ["node", "dist/main"]
