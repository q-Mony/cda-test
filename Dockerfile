# Stage 1: Build the application
FROM node:20-alpine as build

WORKDIR /opt/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# 非打包机打包的话注释下面这句话
RUN npm config set registry http://192.168.100.223:11180/repository/group-npm/
# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code
COPY . .
ENV NODE_ENV production
# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine as serve

# Install serve globally
RUN npm install -g serve

# Set the working directory to /opt/app
WORKDIR /opt/app

# Copy the built application from the build stage
COPY --from=build /opt/app/build /opt/app/build

# Copy the server folder
COPY --from=build /opt/app/server /opt/app/server

# Expose port 8989
EXPOSE 8989

RUN npm install -g koa koa-router axios crypto-js koa-session koa-static koa-send --verbose
# Set PATH environment variable to include globally installed Node.js packages
ENV NODE_PATH=/usr/local/lib/node_modules/

# CMD ["sh", "-c", "npm list -g --depth=0 && node -v && node server/server.js"]
# Start the server
CMD ["node", "server/server.js"]
