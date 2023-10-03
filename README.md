# NC News SQL API

A RESTful API with a PostgreSQL database.

[https://nc-news-finale.fly.dev/api](https://nc-news-finale.fly.dev/api)

## Requirements

- Node v18.17.1: [download](https://nodejs.org/en/)
- PostgreSQL v13.3: [download](https://www.postgresql.org/download/)
- Docker 24.0.6: [download](https://www.docker.com/)

## Installation

```sh
git clone https://github.com/dentednerd/nc-news-sql.git
cd nc-news-sql
npm run docker:build
npm run docker:seed
```

Dev environment will be available on [localhost:9090](http://localhost:9090).

## Testing

```sh
npm t # jest --verbose
```

## Deployment

```sh
# first time:
flyctl launch
npm run deploy
npm run seed:prod

# subsequently:
npm run deploy
```
