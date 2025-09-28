import dotenv from 'dotenv';
dotenv.config(); // load .env variables

const config = {
    // server port
    serverPort: process.env.PORT || 5000,
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'db',
        database: process.env.DB_NAME || 'ems',
        password: process.env.DB_PASSWORD || 'password',
        port: Number(process.env.DB_PORT) || 5432,
    },
    JWT_SECRET:process.env.JWT_SECRET,
    OPENAI_API_KEY:process.env.OPENAI_API_KEY

};

export default config;
