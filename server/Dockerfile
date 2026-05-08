FROM node:22-alpine

WORKDIR /app

# copy packages.json file increases build time but allows better caching of node modules
COPY package*.json ./

# install requirements
RUN npm install

# copy all code files
COPY . .


EXPOSE 5000

CMD ["npm", "run", "dev"]