FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:22.12-alpine

WORKDIR /app

ENV SERVER_PORT=4300

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4300

#CMD ["node","index.js"]
CMD ["npm", "start"]


