import { DataSource } from 'typeorm';

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

  // Create admin user - password will be hashed by @BeforeInsert hook
  const adminUser = await userRepository.save({
    email: 'admin@pitchcontrol.com',
    username: 'admin',
    password: 'Alamo123',
    firstName: 'System',
    lastName: 'Administrator',
    phoneNumber: '+1234567890',
    isActive: true,
  });

  // Assign LEAGUE_ADMIN role globally (leagueId = undefined for global role)
  await userLeagueRoleRepository.save({
    userId: adminUser.id,
    leagueId: undefined,
    role: 'LEAGUE_ADMIN',
  });

  console.log('✅ Default admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: Alamo123');
  console.log('   Email: admin@pitchcontrol.com');
}
