import State from './State';
import { MIN_GROUP_WORDS, MIN_PAGE_WORDS, MIN_LIMIT_WORDS, MAX_LIMIT_WORDS } from './constants';
import { IApiWords, IUserAggregatedWords, IUserWord } from './interfaces';

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

  // async signIn(user: IUserAuth) {
  //   const resp = await fetch(this.signinUrl, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(user),
  //   });

  //   return <IUserAuth>await resp.json();
  // }

  async getWords(groupId = MIN_GROUP_WORDS, pageId = MIN_PAGE_WORDS) {
    const url = `${this.wordsUrl}?group=${groupId}&page=${pageId}`;

    const resp = await fetch(url);
    return <IApiWords[]>await resp.json();
  }

  private async setUserWord(method: string, id: string, difficulty: string, isStudy = false) {
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

  public async postUserWord(id: string, difficulty: string, isStudy = false) {
    const userWordData = await this.setUserWord('POST', id, difficulty, isStudy);
    return userWordData;
  }

  public async updateUserWord(id: string, difficulty: string, isStudy = false) {
    const userWordData = await this.setUserWord('PUT', id, difficulty, isStudy);
    return userWordData;
  }

  async getUserWords() {
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

  async getUserWord(wordId: string) {
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

  private async aggregatedWords(wordUrl: string) {
    const aggregatedWordUrl = wordUrl;

    const resp = await fetch(aggregatedWordUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getToken() || ''}`,
        Accept: 'application/json',
      },
    });
    return <IUserAggregatedWords[]>await resp.json();
  }

  public async aggregatedHardWords() {
    const limit = MAX_LIMIT_WORDS;
    const aggregatedWordUrl = `
      ${this.usersUrl}/${this.getUserId()}/aggregatedWords?wordsPerPage=${limit}&filter={"userWord.difficulty":"hard"}
    `;
    const aggregatedWordsData = await this.aggregatedWords(aggregatedWordUrl);
    return aggregatedWordsData;
  }

  public async userAggregatedWords(groupId = MIN_GROUP_WORDS, pageId = MIN_PAGE_WORDS) {
    const limit = MIN_LIMIT_WORDS;
    const aggregatedWordUrl = `
      ${
        this.usersUrl
      }/${this.getUserId()}/aggregatedWords?wordsPerPage=${limit}&filter={"group":${groupId}, "page":${pageId}}
    `;
    const aggregatedWordsData = await this.aggregatedWords(aggregatedWordUrl);
    return aggregatedWordsData;
  }
}
