export enum PenaltyCardType {
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export const CardSuspensionMatches: Record<PenaltyCardType, number> = {
  [PenaltyCardType.YELLOW]: 0,
  [PenaltyCardType.RED]: 1,
};
