export type INewUserRegistration = {
  name: string;
  email: string;
  password: string;
};

export type IUserSignIn = {
  email: string;
  password: string;
};

export type IAutentificatedUser = {
  message?: string;
  name: string;
  refreshToken?: string;
  token?: string;
  userId?: string;
};
