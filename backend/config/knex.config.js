const knex = require('knex')({
    client: 'postgres',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        // port: process.env.DB_PORT,
        charset: 'utf8',
    },
    pool: {
        min: 0,
        max: 7,
        //idleTimeoutMillis: 30000,
        afterCreate: (conn, done) => {
            conn.query('SELECT NOW();', (err) => {
                if (err) {
                    console.log(err);
                }
                done(err, conn);
            });
        },
    },
    debug: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'staging'
});

module.exports.knex = knex;