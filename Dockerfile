FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose port 5173
EXPOSE 5173

# Default command runs the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]