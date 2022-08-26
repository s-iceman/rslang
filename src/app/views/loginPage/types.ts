export type INewUserRegistration = {
  isAuth: boolean;
  name: string;
  email: string;
  password: string;
};

export type IUserSignIn = {
  email: string;
  password: string;
};

export type IAutentificatedUser = {
  isAuth?: boolean;
  message?: string;
  name: string;
  refreshToken?: string;
  token?: string;
  userId?: string;
};
