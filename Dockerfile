FROM node:12.4
COPY . /app
WORKDIR ./app
RUN npm install
RUN npm run build

RUN apt-get update && apt-get install -y nginx
RUN rm /etc/nginx/sites-enabled/default*
COPY ./nginx.conf /etc/nginx/sites-enabled/default
WORKDIR /usr/share/nginx/html
RUN cd /app/build/ && cp -r * /usr/share/nginx/html/
#RUN service nginx reload
EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]