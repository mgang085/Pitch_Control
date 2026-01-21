import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { UserLeagueRole } from '../../modules/users/entities/user-league-role.entity';
import { Role } from '../../common/enums/role.enum';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const userLeagueRoleRepository = dataSource.getRepository(UserLeagueRole);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed...');
    return;
  }

  // Create admin user - password will be hashed by @BeforeInsert hook
  const adminUser = userRepository.create({
    email: 'admin@pitchcontrol.com',
    username: 'admin',
    password: 'Alamo123',
    firstName: 'System',
    lastName: 'Administrator',
    phoneNumber: '+1234567890',
    isActive: true,
  });

  const savedAdmin = await userRepository.save(adminUser);

  // Assign LEAGUE_ADMIN role globally (leagueId = undefined for global role)
  const adminRole = userLeagueRoleRepository.create({
    userId: savedAdmin.id,
    leagueId: undefined,
    role: Role.LEAGUE_ADMIN,
  });

  await userLeagueRoleRepository.save(adminRole);

  console.log('✅ Default admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: Alamo123');
  console.log('   Email: admin@pitchcontrol.com');
}
