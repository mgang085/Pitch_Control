export enum Role {
  SPECTATOR = 'SPECTATOR',
  PLAYER = 'PLAYER',
  MATCH_SECRETARY = 'MATCH_SECRETARY',
  COACH = 'COACH',
  PRESIDENT = 'PRESIDENT',
  REFEREE = 'REFEREE',
  HEAD_OFFICIAL = 'HEAD_OFFICIAL',
  LEAGUE_ADMIN = 'LEAGUE_ADMIN',
}

export const RoleHierarchy: Record<Role, number> = {
  [Role.SPECTATOR]: 0,
  [Role.PLAYER]: 1,
  [Role.MATCH_SECRETARY]: 2,
  [Role.COACH]: 3,
  [Role.PRESIDENT]: 4,
  [Role.REFEREE]: 5,
  [Role.HEAD_OFFICIAL]: 6,
  [Role.LEAGUE_ADMIN]: 7,
};
