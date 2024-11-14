# Use an official Node.js runtime as a parent image
FROM node:18-alpine 

# Set the working directory in the container
WORKDIR /my-app

# Copy the package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies using Yarn, only production dependencies for production readiness
RUN yarn install --frozen-lockfile

# Copy the rest of your project files into the container
COPY . .

# Build the application (this step is often for React/Frontend apps)
RUN yarn build

# Expose the port for Railway
EXPOSE 8080

# Use the PORT environment variable if it's set by Railway; fallback to 8080
ENV PORT=8080

CMD ["npx", "serve", "-s", "build", "-l", "8080"]
