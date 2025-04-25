FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Expose port 3000
EXPOSE 3000

# Default command runs the development server
# The --host 0.0.0.0 flag makes the server accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]