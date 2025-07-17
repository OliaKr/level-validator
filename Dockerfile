# Use official Node.js LTS base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose the port the app listens on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
