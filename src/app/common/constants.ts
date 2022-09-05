enum ViewPath {
  MAIN = '/',
  TEXTBOOK = '/textbook',
  STATISTICS = '/statistics',
  LOGIN = '/login',
  ABOUT = '#about',
  TEAM = '#team',
  SPRINT = '/sprint',
  VOICECALL = '/voicecall',
}

const MIN_PAGE_WORDS = 0;
const MAX_PAGE_WORDS = 29;
const MAX_GROUP_WORDS = 6;

enum GameCustomEvents {
  ShowGame = 'ShowGameEvent',
  EndGame = 'EndGame',
}

export { ViewPath, GameCustomEvents, MIN_PAGE_WORDS, MAX_GROUP_WORDS, MAX_PAGE_WORDS };
