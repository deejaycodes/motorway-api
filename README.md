# Motorway Task

Create an API that returns vehicle info based on id and timestamp

# Get started
## Scripts

Start application

```
docker-compose up
```
Get vehicle by id and timestamp

```
curl --location --request GET 'localhost:5000/vehicle/2?timestamp=2022-09-12 19:03:54%2B02:00'
```

Build docker image

```
docker build
```
Run tests with databases inside docker-compose

```
docker-compose up
npm test
```
Run tests with own databases

```
npm test
```
Start application not in a docker container

```
npm start
```
Compile typescript

```
npm run build
```
## Swagger documentation

```
/src/routes/swagger
```
## Custom application setup

-   config.ts file contains all defaults values, if you want to change them, please create `.env` file in root directory with the following properties:

```
# Set to production when deploying to production
NODE_ENV=development

# Node.js server configuration
PORT=8080

# PostgreSQL connection url
PG_URL=postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]

# Redis connection url
REDIS_URL=redis://HOST[:PORT][?db=DATABASE[&password=PASSWORD]]

# Directory for logs created in root direcotry
LOG_DIR=log
```
## Custom tests setup

-   config.ts file contains all defaults values, if you want to change them, please create `.env.test` file in root directory with the following properties:

```
# Set to production when deploying to production
NODE_ENV=development

# Node.js server configuration
PORT=8080

# PostgreSQL connection url
PG_URL=postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]

# Redis connection url
REDIS_URL=redis://HOST[:PORT][?db=DATABASE[&password=PASSWORD]]

# Directory for logs created in root direcotry
LOG_DIR=log
```