import State from './State';
import { MIN_GROUP_WORDS, MIN_PAGE_WORDS, MAX_GROUP_WORDS, MAX_PAGE_WORDS, MAX_LIMIT_WORDS } from './constants';
import { IApiWords, IUserAuth, IUserWord } from './interfaces';

export default class AppModel extends State {
  signinUrl: string;

  usersUrl: string;

  wordsUrl: string;

  constructor(private baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
    this.wordsUrl = `${this.baseUrl}/words`;
    this.usersUrl = `${this.baseUrl}/users`;
    this.signinUrl = `${this.baseUrl}/signin`;
  }

  async signIn(user: IUserAuth) {
    const resp = await fetch(this.signinUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    return <IUserAuth>await resp.json();
  }

  async getWords(_group = MIN_GROUP_WORDS, _page = MIN_PAGE_WORDS) {
    const group = _group < MAX_GROUP_WORDS && _group >= MIN_GROUP_WORDS ? _group : MIN_GROUP_WORDS;
    const page = _page < MAX_PAGE_WORDS && _page >= MIN_PAGE_WORDS ? _page : MIN_PAGE_WORDS;
    const url = `${this.wordsUrl}?group=${group}&page=${page}`;

    const resp = await fetch(url);
    return <IApiWords[]>await resp.json();
  }

  async setUserWord(id: string, method: string, difficulty: string, isStudy = false) {
    if (this.getUserId() !== '') {
      const setUserWords = `${this.usersUrl}/${this.getUserId()}/words/${id}`;
      const word = {
        difficulty: `${difficulty}`,
        optional: {
          study: isStudy,
        },
      };
      const resp = await fetch(setUserWords, {
        method: `${method}`,
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${this.getToken() || ''}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
      return <IUserWord[]>await resp.json();
    }
  }

  async getUserWords() {
    if (this.getUserId() !== '') {
      const userWords = `${this.usersUrl}/${this.getUserId()}/words`;
      const resp = await fetch(userWords, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getToken() || ''}`,
          Accept: 'application/json',
        },
      });
      return <IUserWord[]>await resp.json();
    }
  }

  async getUserWord(wordId: string) {
    if (this.getUserId() !== '') {
      const userWord = `${this.usersUrl}/${this.getUserId()}/words/${wordId}`;

      try {
        const resp = await fetch(userWord, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.getToken() || ''}`,
            Accept: 'application/json',
          },
        });
        return <IUserWord>await resp.json();
      } catch {
        return false;
      }
    }
  }

  async aggregatedWords(_limit = MAX_LIMIT_WORDS) {
    if (this.getUserId() !== '') {
      const aggregatedWordUrl = `
      ${this.usersUrl}/${this.getUserId()}/aggregatedWords?wordsPerPage=${_limit}&filter={"userWord.difficulty":"hard"}
    `;

      const resp = await fetch(aggregatedWordUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getToken() || ''}`,
          Accept: 'application/json',
        },
      });
      return <IUserWord>await resp.json();
    }
  }
}
