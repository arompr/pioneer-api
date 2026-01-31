# Use the latest Node 24 slim image
FROM node:24-slim

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Podman's layer caching
COPY package*.json ./

# Install only production dependencies
# This keeps the image small and secure
RUN npm install --omit=dev

# Copy the rest of your source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Use the 'node' user provided by the official image for better security
USER node

# Expose the port your app runs on
EXPOSE 3000

# Execute using Node 24's native TypeScript stripping
CMD ["node", "src/index.ts"]
