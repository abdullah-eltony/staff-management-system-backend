const dotenv = require('dotenv');
dotenv.config(); // load .env variables

const config = {
    port: process.env.PORT || 5000,
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'ems',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    }
};

module.exports = config;
