# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files into the container
COPY . .

# Build the application (if applicable)
ARG REACT_APP_API_KEY
ARG REACT_APP_AUTH_DOMAIN
ARG REACT_APP_PROJECT_ID
ARG REACT_APP_STORAGE_BUCKET
ARG REACT_APP_MESSAGING_SENDER_ID
ARG REACT_APP_APP_ID
ARG REACT_APP_MEASUREMENT_ID

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]

