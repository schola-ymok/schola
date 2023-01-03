export const setNotifyOnPurchase = async (authAxios, notifyOnPurchase) => {
  try {
    const query = notifyOnPurchase ? 1 : 0;
    const res = await authAxios.put('/api/account/?notifypurchase=' + query);

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
