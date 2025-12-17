FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5556

CMD ["sh", "-c", "\
  if [ \"$ENV\" = 'production' ]; then \
    npm run build && npx serve -s dist -l 5556; \
  else \
    npm run dev; \
  fi"]