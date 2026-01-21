import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Union } from './entities/league.entity';
import { BonusPointRule } from './entities/bonus-point-rule.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Union)
    private readonly unionRepository: Repository<Union>,
    @InjectRepository(BonusPointRule)
    private readonly bonusPointRuleRepository: Repository<BonusPointRule>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto): Promise<Union> {
    const union = this.unionRepository.create(createLeagueDto);
    return this.unionRepository.save(union);
  }

  async findAll(): Promise<Union[]> {
    return this.unionRepository.find({
      relations: ['divisions', 'bonusPointRules'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Union> {
    const union = await this.unionRepository.findOne({
      where: { id },
      relations: ['divisions', 'bonusPointRules'],
    });

    if (!union) {
      throw new NotFoundException(`Union with ID ${id} not found`);
    }

    return union;
  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto): Promise<Union> {
    const union = await this.findOne(id);
    Object.assign(union, updateLeagueDto);
    return this.unionRepository.save(union);
  }

  async remove(id: string): Promise<void> {
    const union = await this.findOne(id);
    await this.unionRepository.remove(union);
  }
}
