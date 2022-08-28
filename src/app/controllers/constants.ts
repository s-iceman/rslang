enum UnitLevels {
  A1 = 0,
  A2,
  B1,
  B2,
  C1,
  C2,
  Hard,
}

const USER_UNITS = [String(UnitLevels.Hard)];

enum DifficultyWord {
  Simple = 'simple',
  Hard = 'hard',
}

enum GameType {
  Sprint = 'sprint',
  VoiceCall = 'voicecall',
}

export { UnitLevels, DifficultyWord, USER_UNITS, GameType };
