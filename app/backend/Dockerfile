FROM node:16.14-alpine
WORKDIR /app-backend
COPY package.json .
RUN npm install
RUN npm run build
COPY . .
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
