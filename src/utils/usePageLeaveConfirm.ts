import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Consts from './Consts';

const usePageLeaveConfirm = (watchChange, checkChange, exceptUrl) => {
  const [isCancel, setIsCancel] = useState(false);
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
    if (checkChange() && !isCancel) {
      router.events.on('routeChangeStart', pageChangeHandler);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        router.events.off('routeChangeStart', pageChangeHandler);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }
  }, watchChange);

  const cancel = () => {
    setIsCancel(true);
  };

  return { cancel: cancel };
};

export default usePageLeaveConfirm;
