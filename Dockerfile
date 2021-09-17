FROM node:lts-alpine

# change working directory to app
WORKDIR /app

# copy package.json file for npm install command
COPY package.json ./

# run the npm install command to install the dependencies
RUN npm install

RUN npm install @vue/cli

EXPOSE 8080

CMD ["npm", "run", "serve"]