# Use official Node.js runtime as parent image
FROM node:14

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]
