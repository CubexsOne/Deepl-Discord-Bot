FROM node:22.12.0-alpine3.20

WORKDIR /app

COPY ./deepl-bot/package.json .
COPY ./deepl-bot/package-lock.json .

RUN npm i

COPY ./deepl-bot .
RUN npm run prisma:generate;

CMD [ "sh", "-c", "npm run prisma:deploy; npm run prod" ]