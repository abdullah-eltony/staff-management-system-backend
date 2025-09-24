import dotenv from 'dotenv';
dotenv.config(); // load .env variables

const config = {
    // server port
    serverPort: process.env.PORT || 5000,
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'ems',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    },
    OPENAI_API_KEY:process.env.OPENAI_API_KEY

};

export default config;
