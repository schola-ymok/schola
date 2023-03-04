import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Consts from './Consts';

const usePageLeaveConfirm = (watchChange, checkChange, exceptUrl) => {
  const router = useRouter();
  const pageChangeHandler = (url) => {
    let except;

    if (Array.isArray(exceptUrl)) {
      exceptUrl.map((item) => {
        if (item == url) except = true;
      });
    } else {
      except = false;
    }

    if (!except) {
      const answer = window.confirm(Consts.PAGE_LEAVE_WARNING_MESSGAE);
      if (!answer) {
        throw 'Abort route';
      }
    }
  };
  const beforeUnloadHandler = (event) => {
    event.returnValue = Consts.PAGE_LEAVE_WARNING_MESSGAE;
  };
  useEffect(() => {
    if (checkChange()) {
      router.events.on('routeChangeStart', pageChangeHandler);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        router.events.off('routeChangeStart', pageChangeHandler);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }
  }, watchChange);
};

export default usePageLeaveConfirm;
