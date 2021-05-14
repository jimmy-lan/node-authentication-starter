FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci
RUN npm install -g typescript
RUN rm -f .npmrc

COPY . .

RUN npm run build

CMD ["npm", "start"]
