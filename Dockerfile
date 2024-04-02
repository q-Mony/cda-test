# Stage 1: Build dependencies
FROM node:20-alpine as dependencies

WORKDIR /opt/

#这两个文件要提交到git仓库
COPY package.json package-lock.json /opt/

#非打包机打包的话注释下面这句话
RUN npm config set registry http://192.168.100.223:11180/repository/group-npm/
# Install dependencies only if lock file changes
RUN npm install --verbose

# Stage 2: Build the application
FROM dependencies as build

# Copy the rest of the application code
COPY ./ /opt/

# Build the application
RUN npm run build

# Stage 3: Create the final image
FROM nginx:1.25.2-alpine-slim

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/
ENV HTTP_URL http://192.168.100.223:8080/



CMD ["/bin/sh", "npm run start"]
