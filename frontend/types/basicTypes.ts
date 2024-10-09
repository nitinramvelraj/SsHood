export type User = {
  email: string;
  password: string;
};

export type NewUser = User & {
  firstname: string;
  lastname: string;
};

export type UserBasicInfo = {
  id: string;
  firstname: string;
  email: string;
  balance: number;
};

export type UserProfileData = {
  firstname: string;
  email: string;
};

export type AddBalance = {
  credit: number;
  user: string;
}