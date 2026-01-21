export enum MatchEventType {
  TRY = 'TRY',
  CONVERSION = 'CONVERSION',
  PENALTY_KICK = 'PENALTY_KICK',
  DROP_GOAL = 'DROP_GOAL',
}

export const EventPoints: Record<MatchEventType, number> = {
  [MatchEventType.TRY]: 5,
  [MatchEventType.CONVERSION]: 2,
  [MatchEventType.PENALTY_KICK]: 3,
  [MatchEventType.DROP_GOAL]: 3,
};
