import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Subscription } from './src/subscription/subscription.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'weather',
    entities: [Subscription],
    migrations: ['./migrations/*.ts'],
    synchronize: false,
    logging: false,
});
