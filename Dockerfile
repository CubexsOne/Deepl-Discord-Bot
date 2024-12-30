FROM --platform=amd64 node:22.12.0-alpine3.20

WORKDIR /app

COPY ./deepl-bot/package.json .
COPY ./deepl-bot/package-lock.json .

RUN npm i

COPY ./deepl-bot .

CMD [ "sh", "-c", "npm run deploy; npm run dev" ]