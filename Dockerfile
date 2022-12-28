ARG TARGETARCH=amd64
FROM node:16-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

ARG TARGETARCH=amd64
FROM ${TARGETARCH}/nginx:1.22.0-alpine
ENV NODE_ENV production

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

COPY --from=builder /app/build /usr/share/nginx/html

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g runtime-env-cra@0.2.4

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
