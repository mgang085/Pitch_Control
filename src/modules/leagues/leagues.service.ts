import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';
import { BonusPointRule } from './entities/bonus-point-rule.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(BonusPointRule)
    private readonly bonusPointRuleRepository: Repository<BonusPointRule>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto): Promise<League> {
    const league = this.leagueRepository.create(createLeagueDto);
    return this.leagueRepository.save(league);
  }

  async findAll(): Promise<League[]> {
    return this.leagueRepository.find({
      relations: ['divisions', 'bonusPointRules'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<League> {
    const league = await this.leagueRepository.findOne({
      where: { id },
      relations: ['divisions', 'bonusPointRules'],
    });

    if (!league) {
      throw new NotFoundException(`League with ID ${id} not found`);
    }

    return league;
  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto): Promise<League> {
    const league = await this.findOne(id);
    Object.assign(league, updateLeagueDto);
    return this.leagueRepository.save(league);
  }

  async remove(id: string): Promise<void> {
    const league = await this.findOne(id);
    await this.leagueRepository.remove(league);
  }
}
