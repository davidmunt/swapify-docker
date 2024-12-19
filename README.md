# Docker infraestructure for swapify-nest
## Init project
git submodule init

git submodule update --recursive

## Copy env file
cp {,.}env

cp swapify-nest/{,.}env
## Set variables
In `swapify-nest/.env` set the variables. Focus on the MYSQL password, it must be the one provided in this .env file.

## Build database
docker-compose up -d && \
DB_HOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' swapify-nest-mysql) && \
mysql -h $DB_HOST -uroot -pmy-secret-pw --ssl-mode=DISABLED < gestio-tic-estacio/app/model/db_swapify-nest.sql

(If fails, try in a few minutes in order to mysql sql be ready)

## Deploy servicies
docker-compose up -d

## Show logs
docker-compose logs -f web_server
