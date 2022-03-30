# NC News SQL API

A RESTful API with a PostgreSQL database.

[http://nc-news-sql-dentednerd.herokuapp.com/api](http://nc-news-sql-dentednerd.herokuapp.com/api)

## Requirements

- Node v14.17.4: [download](https://nodejs.org/en/)
- PostgreSQL v13.3: `brew install postgresql`
- Heroku CLI: `brew tap heroku/brew && brew install heroku`

## Installation

```sh
git clone https://github.com/dentednerd/nc-news-sql-dentednerd.git
cd nc-news-sql-dentednerd
npm install
echo PGDATABASE=nc_news_test > .env.test
echo PGDATABASE=nc_news > .env.development
```

## Usage

```sh
npm run setup-dbs
npm run seed
npm start # runs on port 9090 by default
```

## Testing

```sh
npm t # jest --verbose
```

## Deployment

```sh
# to push to Github:
git push origin main

# to deploy to Heroku:
# ensure that heroku remote exists
git remote -v

# if no heroku remote:
git remote add heroku https://git.heroku.com/nc-news-sql-dentednerd.git
npm run seed:prod # on first deploy only
git push heroku main
```
