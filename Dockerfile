# Stage 1: Build dependencies
FROM node:20-alpine as dependencies

WORKDIR /opt/

# 这两个文件要提交到git仓库
COPY package.json package-lock.json /opt/

# 非打包机打包的话注释下面这句话
RUN npm config set registry http://192.168.100.223:11180/repository/group-npm/
# Install dependencies only if lock file changes
RUN npm install --verbose

# Stage 2: Build the application
FROM dependencies as build

# Copy the rest of the application code
COPY ./ /opt/

# Build the application
RUN npm run build

# Stage 3: Serve the application
FROM node:20-alpine as serve

# Install serve globally
RUN npm install -g serve

# Copy the built application from the build stage to the serve directory
COPY --from=build /opt/build /opt/serve

# Set the working directory to the serve directory
WORKDIR /opt/serve

# Expose port 5000 (default port for serve)
EXPOSE 5000

# Start serve to serve the application
CMD ["serve", "-s", "."]
