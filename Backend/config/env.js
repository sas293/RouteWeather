import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'OWM_API_KEY',
    'ORS_API_KEY',
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(
            `Missing required environment variable: ${key}`
        );
    }
}

export const config = {
    orsApiKey: process.env.ORS_API_KEY,
    owmApiKey: process.env.OWM_API_KEY,

    port: process.env.PORT || 3000,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};