FROM node:22-alpine


WORKDIR /app

# copy packages.json
COPY package*.json ./

# install all requirements
RUN npm install

# copy all code files
COPY . .

EXPOSE 5173

# application run command
CMD ["npm", "run", "dev", "--", "--host"]