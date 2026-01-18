# Use Node 24 official image
FROM node:24

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Node app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
