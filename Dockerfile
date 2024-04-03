# 使用 Node.js 作为基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /opt/app

# 安装项目依赖项
COPY package*.json ./
RUN npm config set registry http://192.168.100.223:11180/repository/group-npm/
RUN npm install --verbose

# 将整个项目目录复制到工作目录
COPY . .

# 将 server 目录拷贝到与 build 目录同一级别
COPY server /opt/app/server

# 全局安装所需的 Node.js 包
RUN npm install -g koa koa-router axios crypto-js koa-session koa-static koa-send --verbose

# 暴露端口（根据您的实际情况更改端口号）
EXPOSE 8989

# 定义启动命令
CMD ["node", "server/server.js"]
