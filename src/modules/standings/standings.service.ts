import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standing } from './entities/standing.entity';
import { Match } from '../matches/entities/match.entity';
import { MatchStatus } from '../../common/enums/match-status.enum';

@Injectable()
export class StandingsService {
  constructor(
    @InjectRepository(Standing)
    private readonly standingRepository: Repository<Standing>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async calculateStandings(divisionId: string): Promise<Standing[]> {
    const matches = await this.matchRepository.find({
      where: { divisionId, status: MatchStatus.FINISHED },
      relations: ['homeTeam', 'awayTeam'],
    });

    const standingsMap = new Map<string, any>();

    matches.forEach((match) => {
      if (!standingsMap.has(match.homeTeamId)) {
        standingsMap.set(match.homeTeamId, this.initializeStanding(divisionId, match.homeTeamId));
      }
      if (!standingsMap.has(match.awayTeamId)) {
        standingsMap.set(match.awayTeamId, this.initializeStanding(divisionId, match.awayTeamId));
      }

      const homeStanding = standingsMap.get(match.homeTeamId);
      const awayStanding = standingsMap.get(match.awayTeamId);

      homeStanding.played += 1;
      awayStanding.played += 1;

      homeStanding.pointsFor += match.homeScore;
      homeStanding.pointsAgainst += match.awayScore;
      homeStanding.triesScored += match.homeTries;

      awayStanding.pointsFor += match.awayScore;
      awayStanding.pointsAgainst += match.homeScore;
      awayStanding.triesScored += match.awayTries;

      homeStanding.bonusPoints += match.homeBonusPoints;
      awayStanding.bonusPoints += match.awayBonusPoints;

      if (match.homeScore > match.awayScore) {
        homeStanding.won += 1;
        homeStanding.totalPoints += 4;
        awayStanding.lost += 1;
      } else if (match.awayScore > match.homeScore) {
        awayStanding.won += 1;
        awayStanding.totalPoints += 4;
        homeStanding.lost += 1;
      } else {
        homeStanding.drawn += 1;
        awayStanding.drawn += 1;
        homeStanding.totalPoints += 2;
        awayStanding.totalPoints += 2;
      }

      homeStanding.totalPoints += match.homeBonusPoints;
      awayStanding.totalPoints += match.awayBonusPoints;
    });

    await this.standingRepository.delete({ divisionId });

    const standings = Array.from(standingsMap.values()).map((data) => {
      data.pointsDifference = data.pointsFor - data.pointsAgainst;
      return this.standingRepository.create(data);
    });

    await this.standingRepository.save(standings);

    return standings.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.pointsDifference !== a.pointsDifference)
        return b.pointsDifference - a.pointsDifference;
      return b.triesScored - a.triesScored;
    });
  }

  async getStandings(divisionId: string): Promise<Standing[]> {
    const standings = await this.standingRepository.find({
      where: { divisionId },
      relations: ['team', 'division'],
    });

    if (standings.length === 0) {
      return this.calculateStandings(divisionId);
    }

    return standings.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.pointsDifference !== a.pointsDifference)
        return b.pointsDifference - a.pointsDifference;
      return b.triesScored - a.triesScored;
    });
  }

  private initializeStanding(divisionId: string, teamId: string) {
    return {
      divisionId,
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDifference: 0,
      triesScored: 0,
      triesConceded: 0,
      bonusPoints: 0,
      penaltyPoints: 0,
      totalPoints: 0,
    };
  }
}
