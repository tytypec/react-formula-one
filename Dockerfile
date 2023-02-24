FROM node:14-slim

WORKDIR /usr/src/app

COPY ./package.json ./

RUN yarn install

COPY . .

# does this need to match what my sever is listening for?
EXPOSE 3000

CMD [ "npm", "start" ]