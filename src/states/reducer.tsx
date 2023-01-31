import { Action } from './action';
import { Store } from './store';

export const reducer = (state: Store, action: Action): Store => {
  console.log('ACTION:' + action.type);
  if (action.type == 'Login') {
    return {
      ...state,
      isLoggedin: true,
      accountName: action.accountName,
      displayName: action.displayName,
      noticeCount: action.noticeCount,
      userId: action.userId,
      photoId: action.photoId,
    };
  } else if (action.type == 'PreLogin') {
    return {
      ...state,
      displayName: action.displayName,
      email: action.email,
      emailVerified: action.emailVerified,
    };
  } else if (action.type == 'Logout') {
    return {
      ...state,
      isLoggedin: false,
    };
  } else if (action.type == 'Banned') {
    return {
      ...state,
      banned: true,
    };
  } else if (action.type == 'SetProfilePhoto') {
    return {
      ...state,
      photoId: action.photoId,
    };
  } else {
    return state;
  }
};
