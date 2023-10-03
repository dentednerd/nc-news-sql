const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  console.log("About to start seeding...");
  console.log(process.env.DATABASE_URL || process.env.PGDATABASE);
  return seed(devData).then(() => {
    console.log("Seeding complete!");
    db.end();
  });
};

runSeed();
