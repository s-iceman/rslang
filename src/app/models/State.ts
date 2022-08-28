import { IUserAuth } from './interfaces';

export default class State {
  private _sounds: HTMLAudioElement[];

  private _storage: IUserAuth;

  constructor() {
    this._sounds = [];
    this._storage = localStorage.getItem('user') ? <IUserAuth>JSON.parse(localStorage.getItem('user') || '') : {};
  }

  setSoundList(value: HTMLAudioElement) {
    return this._sounds.push(value);
  }

  getSoundList() {
    return this._sounds;
  }

  clearSoundList() {
    this._sounds = [];
  }

  getUserId() {
    return this._storage.userId || '';
  }

  isAuth() {
    return true; //this._storage.isAuth || false;
  }

  setStorage(value: string) {
    this._storage = <IUserAuth>JSON.parse(value);
  }

  getStorage() {
    return this._storage;
  }

  getToken() {
    return this._storage.token;
  }
}
