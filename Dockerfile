FROM node:lts-alpine3.12


RUN mkdir -p /server/src

WORKDIR /server/src

COPY package.json .

RUN npm install

COPY . .

EXPOSE 1304

CMD ["npm","start"]