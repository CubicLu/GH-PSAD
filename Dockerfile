FROM node:12.4 AS build
COPY . /app
WORKDIR ./app
RUN npm install
RUN npm run build
VOLUME /app

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build ./
EXPOSE 80
