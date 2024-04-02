FROM node:18.13-alpine as ybuild

WORKDIR /opt/

COPY ./ /opt/

RUN npm config set registry RUN npm config set registry http://192.168.100.223:11180/repository/group-npm/

RUN npm install --verbose

RUN npm build

FROM nginx:1.20.2-alpine
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/
ENV HTTP_URL http://192.168.100.223:8080/
COPY --from=yBuild  /opt/dist /usr/share/nginx/html/
COPY --from=ybuild  /opt/default.conf /etc/nginx/conf.d/
#CMD ["/bin/sh","-c", "nginx -g 'daemon off;'"]