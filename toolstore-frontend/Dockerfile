# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package info and install
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build app (optional if we just want to run dev server)
# RUN npm run build

# Expose port (Vite default is 5173)
EXPOSE 5173

# Run vite dev server exposing to all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
