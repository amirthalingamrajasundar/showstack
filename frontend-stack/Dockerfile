# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /src

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx server to serve the build
FROM nginx:1.21
COPY --from=0 /src/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]