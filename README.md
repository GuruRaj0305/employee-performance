

# Local Setup

## Prerequisites

- Docker
- Docker Compose

## Steps

1. Clone the repository

   ```bash
   git clone https://github.com/GuruRaj0305/employee-performance.git
   ```

2. create .env in both root directory and /server(here for migration purpose), and copy exammple.env to both.


2. Navigate to the project directory

    ```bash
    cd employee-performance
    ```


3. Start the application using Docker Compose

    ```bash
    docker compose up
    ```


4. Open a new terminal and navigate to the server directory

    ```bash
    cd server
    ```


    
5. Run database migrations

    ```bash
    npm run migrate
    ```


6. Seed the database

    ```bash
    npm run seed
    ```

7. Access the application in your browser

    ```bash 
    http://localhost
    ```

8. Admin Creds

    ```
    email : admin@gmail.com
    password : admin123
    ```



### Deployed Application


> url : http



Demo Credentials : 

Admin: 
> Email: admin@gmail.com
> password: admin123

Employee: 

1. > Email: arun@gmail.com
   > passwrod : Qwerty@123

2. > Email: kiran@gmail.com
   > passwrod : Qwerty@123


### high level end points

+ **server health check** : ```/api/_healthz```
+ **gateway health check** : ```/gateway/_healthz```
+ **backend uri** : ```/api```
+ **frontend uri** : ```/```
+ **swagger api docs uri** : ```/api/docs```