import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserLeagueRole } from './entities/user-league-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLeagueRole)
    private readonly userLeagueRoleRepository: Repository<UserLeagueRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    await this.assignDefaultRole(savedUser.id);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['leagueRoles', 'leagueRoles.league'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['leagueRoles', 'leagueRoles.league'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['leagueRoles', 'leagueRoles.league'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['leagueRoles', 'leagueRoles.league'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }

  async assignRole(userId: string, leagueId: string | null, role: Role): Promise<UserLeagueRole> {
    const existingRole = await this.userLeagueRoleRepository.findOne({
      where: { userId, leagueId: leagueId ?? undefined },
    });

    if (existingRole) {
      existingRole.role = role;
      return this.userLeagueRoleRepository.save(existingRole);
    }

    const userLeagueRole = this.userLeagueRoleRepository.create({
      userId,
      leagueId: leagueId ?? undefined,
      role,
    });

    return this.userLeagueRoleRepository.save(userLeagueRole);
  }

  private async assignDefaultRole(userId: string): Promise<void> {
    await this.assignRole(userId, null, Role.SPECTATOR);
  }

  async getUserRoles(userId: string, leagueId?: string): Promise<Role[]> {
    const query = this.userLeagueRoleRepository
      .createQueryBuilder('ulr')
      .where('ulr.userId = :userId', { userId });

    if (leagueId) {
      query.andWhere('(ulr.leagueId = :leagueId OR ulr.leagueId IS NULL)', { leagueId });
    }

    const roles = await query.getMany();
    return roles.map((r) => r.role);
  }
}
