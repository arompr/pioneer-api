# Use the latest Node 24 slim image
FROM node:24-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Podman's layer caching
COPY package*.json ./

# Install only production dependencies
# This keeps the image small and secure
RUN npm install

# Copy the rest of your source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main.js"]
