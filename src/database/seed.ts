import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedAdminUser } from './seeders/admin.seeder';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pitch_control',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('🌱 Running database seeders...');

    await seedAdminUser(AppDataSource);

    console.log('✅ All seeders completed successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  }
}

runSeeds();
