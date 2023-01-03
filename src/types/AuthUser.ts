import User from 'types/User';

type AuthUser = {
  emailVerified?: boolean;
  notifyOnPurchase?: boolean;
  notifyOnReviewed?: boolean;
  user: User;
};

export default AuthUser;
