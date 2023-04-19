FROM node:18.13-alpine
WORKDIR /app-backend
COPY package.json .
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
