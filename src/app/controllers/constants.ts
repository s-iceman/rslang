const baseUrl = 'http://localhost:8082'; //https://rs-react-learnwords-example.herokuapp.com/

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

const EMPTY_GAME_DATA = -1;

export { UnitLevels, DifficultyWord, USER_UNITS, GameType, EMPTY_GAME_DATA, baseUrl };
