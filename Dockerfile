FROM node:14-alpine

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY server/package*.json /usr/src/app/
RUN npm ci --only=production

COPY server /usr/src/app

ENTRYPOINT ["npm", "start"]
