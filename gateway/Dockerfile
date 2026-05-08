FROM nginx:stable-alpine

# remove default nginx config of container
RUN rm /etc/nginx/conf.d/default.conf

# copy nginx files
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d

# listen localhost:80
EXPOSE 80

# start nginx server
CMD ["nginx", "-g", "daemon off;"]