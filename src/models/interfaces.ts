interface IApiWords {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  difficulty?: string;
}

interface IUserAuth {
  isAuth?: boolean;
  name?: string;
  token?: string;
  userId?: string;
  refreshToken?: string;
  message?: string;
  email?: string;
  password?: string;
}

interface IUserWord {
  difficulty: string;
  id: string;
  wordId: string;
  optional: {
    study: boolean;
  };
}
export { IApiWords, IUserAuth, IUserWord };
