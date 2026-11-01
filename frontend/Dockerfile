# TrustChain AI - Frontend Dockerfile
# Multi-stage build with Node 20 and Nginx Alpine

# Stage 1: Build the React + Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with cached layers
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application sources
COPY . .

# Build production distribution
ENV VITE_API_URL=/api/v1
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine

# Copy built static files to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

