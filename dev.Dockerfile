# Development docker file
FROM node:alpine

# ARG NPM_TOKEN

WORKDIR /app
# COPY .npmrc .
COPY package.json .
# RUN npm install --only=production
RUN npm install
# RUN rm -f .npmrc

COPY . .

CMD ["npm", "start"]