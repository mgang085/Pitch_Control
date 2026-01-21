import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchEvent } from './entities/match-event.entity';
import { PenaltyCard } from './entities/penalty-card.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { EventPoints, MatchEventType } from '../../common/enums/match-event-type.enum';
import { MatchStatus } from '../../common/enums/match-status.enum';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchEvent)
    private readonly matchEventRepository: Repository<MatchEvent>,
    @InjectRepository(PenaltyCard)
    private readonly penaltyCardRepository: Repository<PenaltyCard>,
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    if (createMatchDto.homeTeamId === createMatchDto.awayTeamId) {
      throw new BadRequestException('Home and away teams must be different');
    }

    const match = this.matchRepository.create(createMatchDto);
    return this.matchRepository.save(match);
  }

  async findAll(divisionId?: string): Promise<Match[]> {
    const where = divisionId ? { divisionId } : {};
    return this.matchRepository.find({
      where,
      relations: ['homeTeam', 'awayTeam', 'division'],
      order: { scheduledTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['homeTeam', 'awayTeam', 'division', 'events', 'penaltyCards'],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOne(id);
    Object.assign(match, updateMatchDto);
    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const match = await this.findOne(id);
    await this.matchRepository.remove(match);
  }

  async startMatch(id: string): Promise<Match> {
    const match = await this.findOne(id);
    match.status = MatchStatus.IN_PROGRESS;
    match.actualStartTime = new Date();
    return this.matchRepository.save(match);
  }

  async endMatch(id: string): Promise<Match> {
    const match = await this.findOne(id);
    match.status = MatchStatus.FINISHED;
    match.actualEndTime = new Date();
    return this.matchRepository.save(match);
  }

  async recordEvent(matchId: string, createEventDto: CreateMatchEventDto): Promise<MatchEvent> {
    const match = await this.findOne(matchId);

    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new BadRequestException('Can only record events for matches in progress');
    }

    const points = EventPoints[createEventDto.eventType];
    const event = this.matchEventRepository.create({
      ...createEventDto,
      matchId,
      points,
    });

    const savedEvent = await this.matchEventRepository.save(event);

    if (createEventDto.teamId === match.homeTeamId) {
      match.homeScore += points;
      if (createEventDto.eventType === MatchEventType.TRY) {
        match.homeTries += 1;
      }
    } else {
      match.awayScore += points;
      if (createEventDto.eventType === MatchEventType.TRY) {
        match.awayTries += 1;
      }
    }

    await this.matchRepository.save(match);

    return savedEvent;
  }
}
