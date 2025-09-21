FROM node:current-alpine3.22 AS builder

WORKDIR /app

COPY package.* .
RUN npm install

COPY . .
RUN npm run build

FROM node:current-alpine3.22 AS prod

WORKDIR /app

COPY --from=builder /app/package.json ./package.json 
COPY --from=builder /app/package-lock.json ./package-lock.json 
RUN npm install --only=production
COPY --from=builder /app/dist ./dist


CMD [ "npm" , "start" ]