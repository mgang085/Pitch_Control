import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standing } from './entities/standing.entity';
import { Match } from '../matches/entities/match.entity';
import { Division } from '../divisions/entities/division.entity';
import { MatchStatus } from '../../common/enums/match-status.enum';

@Injectable()
export class StandingsService {
  constructor(
    @InjectRepository(Standing)
    private readonly standingRepository: Repository<Standing>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async calculateStandings(divisionId: string): Promise<Standing[]> {
    // Load division with union to get point settings
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId },
      relations: ['union'],
    });

    if (!division || !division.union) {
      throw new NotFoundException(`Division with ID ${divisionId} not found or has no union`);
    }

    const union = division.union;

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

      // Calculate bonus points dynamically based on union settings
      let homeBonusPoints = 0;
      let awayBonusPoints = 0;

      // Bonus points for scoring tries
      if (match.homeTries >= union.minimumTriesForBonus) {
        homeBonusPoints += union.bonusPointsForTries;
      }
      if (match.awayTries >= union.minimumTriesForBonus) {
        awayBonusPoints += union.bonusPointsForTries;
      }

      // Determine match result and award points
      if (match.homeScore > match.awayScore) {
        // Home team wins
        homeStanding.won += 1;
        homeStanding.totalPoints += union.winPoints;
        awayStanding.lost += 1;
        awayStanding.totalPoints += union.lossPoints;

        // Losing bonus point for close loss
        const losingMargin = match.homeScore - match.awayScore;
        if (losingMargin <= union.maximumLosingMarginForBonus) {
          awayBonusPoints += union.bonusPointsForLosingMargin;
        }
      } else if (match.awayScore > match.homeScore) {
        // Away team wins
        awayStanding.won += 1;
        awayStanding.totalPoints += union.winPoints;
        homeStanding.lost += 1;
        homeStanding.totalPoints += union.lossPoints;

        // Losing bonus point for close loss
        const losingMargin = match.awayScore - match.homeScore;
        if (losingMargin <= union.maximumLosingMarginForBonus) {
          homeBonusPoints += union.bonusPointsForLosingMargin;
        }
      } else {
        // Draw
        homeStanding.drawn += 1;
        awayStanding.drawn += 1;
        homeStanding.totalPoints += union.drawPoints;
        awayStanding.totalPoints += union.drawPoints;
      }

      // Add calculated bonus points
      homeStanding.bonusPoints += homeBonusPoints;
      awayStanding.bonusPoints += awayBonusPoints;
      homeStanding.totalPoints += homeBonusPoints;
      awayStanding.totalPoints += awayBonusPoints;
    });

    await this.standingRepository.delete({ divisionId });

    const standingData = Array.from(standingsMap.values()).map((data) => {
      data.pointsDifference = data.pointsFor - data.pointsAgainst;
      return data;
    });

    const standings = this.standingRepository.create(standingData);
    const savedStandings = await this.standingRepository.save(standings);

    return savedStandings.sort((a, b) => {
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
