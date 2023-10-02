# NC News SQL API

A RESTful API with a PostgreSQL database.

## Requirements

- Node v18.17.1: [download](https://nodejs.org/en/)
- PostgreSQL v13.3: [download](https://www.postgresql.org/download/)
- Docker 24.0.6: [download](https://www.docker.com/)

## Installation

```sh
git clone https://github.com/dentednerd/nc-news-sql-dentednerd.git
cd nc-news-sql-dentednerd
docker build . -t nc-news
docker compose up
docker exec -ti news-server bash
npm run seed
exit
```

## Usage

```sh
npm run setup-dbs # if not running in Docker
npm run seed
npm start # runs on port 9090 by default
```

## Testing

```sh
npm t # jest --verbose
```

## Deployment

```sh
git push origin main
```

## to do

- `docker exec -ti news-server bash` then `npm run seed` to seed, woohoo
- `docker compose down -v` to destroy the PG volume
- use EJS to create views for docs
