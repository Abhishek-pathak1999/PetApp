# Build stage

FROM node:18-alpine as builder

WORKDIR /app

COPY ./package-lock.json ./
COPY ./package.json ./

RUN npm install

COPY . .


RUN npm run build



FROM nginx:1.19.0

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]