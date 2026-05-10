FROM node:22-alpine


WORKDIR /app

# copy packages.json
# copy all code files
COPY . .

# install all requirements
RUN npm install



EXPOSE 5173

# application run command
CMD ["npm", "run", "dev", "--", "--host"]