FROM node:alpine

WORKDIR /app
# COPY .npmrc .
COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production
RUN npm install -g typescript
RUN rm -f .npmrc

COPY . .

RUN npm run build

CMD ["npm", "start"]