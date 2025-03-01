import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    // host: process.env.DATABASE_HOST || 'localhost',
    // port: process.env.DATABASE_PORT || 5432,
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME,
    url: process.env.DATABASE_URL,
    synchronize: process.env.DATABASE_SYNCHRONIZE==='true'? true: false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD==='true'? true: false,
}))