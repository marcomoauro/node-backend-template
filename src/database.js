import pgPromise from 'pg-promise';
import monitor from 'pg-monitor';
import log from "./log.js";

const initOptions = {
  query(e) {
    monitor.query(e);
  },
  error(err, e) {
    monitor.error(err, e);
  }
};

const pgp = pgPromise(initOptions);

// https://stackoverflow.com/questions/39168501/pg-promise-returns-integers-as-strings
pgp.pg.types.setTypeParser(20, parseInt)

let db;

monitor.setLog((msg, info) => {
  info.display = false; // to avoid library default log

  const query_log = msg.split('\n').slice(1).join(' ')
  log.query(query_log);
});

const getConnectionPool = () => {
  if (!db) {
    db = pgp({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
    });
  }
  return db
}

export default getConnectionPool()
