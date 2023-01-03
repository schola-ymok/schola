export const setNotifyOnReview = async (authAxios, notifyOnReview) => {
  try {
    const query = notifyOnReview ? 1 : 0;
    const res = await authAxios.put('/api/account/?notifyreview=' + query);

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
