# 使用Node.js官方提供的LTS版本作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器中
COPY package*.json .

# 安装项目依赖
RUN npm install

# 复制整个项目到容器中
COPY . .

# 对外暴露Express应用使用的端口
EXPOSE 3000

# 启动Express应用
CMD ["npm", "start"]