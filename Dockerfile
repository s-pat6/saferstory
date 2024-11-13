# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of your project files into the container
COPY . .

# Build the application
RUN yarn build

# Expose the port for Railway
EXPOSE 8080

# Use the PORT environment variable if it's set by Railway; fallback to 8080
ENV PORT 8080

# Serve the static files using a simple Node server
CMD ["yarn", "start"]
