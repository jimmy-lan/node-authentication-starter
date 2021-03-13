# Development docker file
FROM node:alpine

# ARG NPM_TOKEN

WORKDIR /app
# COPY .npmrc .
COPY package.json .
COPY package-lock.json .
# RUN npm ci --only=production
RUN npm ci
# RUN rm -f .npmrc

COPY . .

RUN npm run build

CMD ["npm", "start"]