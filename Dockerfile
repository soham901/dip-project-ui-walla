FROM node:slim

WORKDIR /app
COPY . .
RUN npm i

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
