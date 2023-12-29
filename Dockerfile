FROM node:slim

WORKDIR /sbs_strava_backend

COPY . . 

RUN npm install 

CMD [ "node", "index.js" ]

EXPOSE 80

EXPOSE 443