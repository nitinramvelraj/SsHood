export interface UserBasicInfo {
  id: string;
  email: string;
  firstname: string;
  balance: number;
}

export interface User {
  email: string;
  password: string;
}

export interface NewUser extends User {
  firstname: string;
  lastname: string;
}

export interface PortfolioItem {
  name: string;
  num_shares: number;
  stock_id: string;
  ticker: string;
  value: number;
}

export interface AddBalance {
  user: string;
  credit: number;
}

export interface SearchResult {
  currentPosition: number;
  currentPositionValue: number;
  name: string;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RootState {
  user: {
    basicInfo: UserBasicInfo | null;
    token: string | null;
  };
}