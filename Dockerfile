ARG TARGETARCH=amd64
FROM node:16-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

ARG TARGETARCH=amd64
FROM kubeshark/nginx-runtime-env-cra:${TARGETARCH}
ENV NODE_ENV production

COPY conf /etc/nginx
COPY --from=builder /app/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
COPY .env .

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
