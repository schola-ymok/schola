export type Login = {
  type: 'Login';
  userId: string;
  accountName: string;
  displayName: string;
  photoId: string;
};

export type Logout = {
  type: 'Logout';
};

export type PreLogin = {
  type: 'PreLogin';
  displayName: string;
  email: string;
  emailVerified: boolean;
};

export type Banned = {
  type: 'Banned';
};

export type SetProfilePhoto = {
  type: 'SetProfilePhoto';
  photoId: string;
};

export type SetLogTagID = {
  type: 'SetLogTagID';
  logTagID: string;
};

export type Action = Login | Logout | PreLogin | SetProfilePhoto | SetLogTagID;
