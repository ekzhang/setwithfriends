FROM node:14-alpine

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package*.json /usr/src/app/
RUN npm ci --only=production

COPY server/config /usr/src/app/config
COPY server/src /usr/src/app/src

ENTRYPOINT ["npm", "--prefix", "server", "start"]
