export const setNotifyOnReview = async (authAxios, notifyOnReview, mail) => {
  try {
    const queryNotifyOnReview = notifyOnReview ? 1 : 0;
    const queryMail = mail ? 1 : 0;

    const res = await authAxios.put(
      '/api/account/?notifyreview=' + queryNotifyOnReview + '&mail=' + queryMail,
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
