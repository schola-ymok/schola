export const setNotifyOnPurchase = async (authAxios, notifyOnPurchase, mail) => {
  try {
    const queryNotifyOnPurchase = notifyOnPurchase ? 1 : 0;
    const queryMail = mail ? 1 : 0;
    const res = await authAxios.put(
      '/api/account/?notifypurchase=' + queryNotifyOnPurchase + '&mail=' + queryMail,
    );

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
