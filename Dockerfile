# 使用官方 Node 镜像作为构建环境
FROM node:20-alpine AS build

# 设置工作目录
WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm i pnpm -g

COPY package.json .

COPY pnpm-lock.yaml .

# 安装依赖
RUN pnpm install 

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build

# 使用 Nginx 作为生产服务器
FROM nginx:alpine

# 将构建好的文件复制到 Nginx 的默认目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

