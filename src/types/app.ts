export type TSearchInput = {
  userId: string;
  search: string;
  accessToken: string;
};

type TRequest = {
  id: string;
  appId: string;
  statusCode: number;
  duration: number;
  startedAt: string;
  createdAt: string;
  deletedAt: string | null;
};

type TRequestTime = {
  id: string;
  appId: string;
  start: string;
  end: string;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TApp = {
  id: string;
  userId: string;
  name: string;
  url: string;
  requestInterval: string;
  isDisabled: boolean;
  requests: TRequest[];
  requestTimes: TRequestTime[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};