import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Division } from './entities/division.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto): Promise<Division> {
    const division = this.divisionRepository.create(createDivisionDto);
    return this.divisionRepository.save(division);
  }

  async findAll(leagueId?: string): Promise<Division[]> {
    const where = leagueId ? { leagueId } : {};
    return this.divisionRepository.find({
      where,
      relations: ['union', 'teams'],
      order: { level: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id },
      relations: ['union', 'teams'],
    });

    if (!division) {
      throw new NotFoundException(`Division with ID ${id} not found`);
    }

    return division;
  }

  async update(id: string, updateDivisionDto: UpdateDivisionDto): Promise<Division> {
    const division = await this.findOne(id);
    Object.assign(division, updateDivisionDto);
    return this.divisionRepository.save(division);
  }

  async remove(id: string): Promise<void> {
    const division = await this.findOne(id);
    await this.divisionRepository.remove(division);
  }
}
