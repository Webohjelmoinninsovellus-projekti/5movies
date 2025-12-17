FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g nodemon

RUN npm install

COPY . .

EXPOSE 5555

CMD ["npm", "run", "dev"]

CMD ["sh", "-c", "\
  if [ \"$ENV\" = 'production' ]; then \
    npm run prod; \
  else \
    npm run dev; \
  fi"]