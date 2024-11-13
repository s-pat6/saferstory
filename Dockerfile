# Use a Node.js image to build the app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the source code and build the app
COPY . .
RUN yarn build

# Use a lightweight web server to serve static files
FROM node:18-slim
WORKDIR /app
RUN yarn global add serve

# Copy the build output from the builder stage
COPY --from=builder /app/build ./build

# Expose port 3000 and run the app with `serve`
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]
