import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository('User');
  const userLeagueRoleRepository = dataSource.getRepository('UserLeagueRole');

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed...');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Alamo123', 10);

  const adminUser = await userRepository.save({
    email: 'admin@pitchcontrol.com',
    username: 'admin',
    password: hashedPassword,
    firstName: 'System',
    lastName: 'Administrator',
    phoneNumber: '+1234567890',
    isActive: true,
  });

  // Assign LEAGUE_ADMIN role globally (leagueId = null)
  await userLeagueRoleRepository.save({
    userId: adminUser.id,
    leagueId: null,
    role: 'LEAGUE_ADMIN',
  });

  console.log('✅ Default admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: Alamo123');
  console.log('   Email: admin@pitchcontrol.com');
}
