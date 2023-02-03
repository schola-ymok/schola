export const setNotifyOnUpdate = async (authAxios, notifyOnUpdate, mail) => {
  try {
    const queryNotifyOnUpdate = notifyOnUpdate ? 1 : 0;
    const queryMail = mail ? 1 : 0;

    const res = await authAxios.put(
      '/api/account/?notifyupdate=' + queryNotifyOnUpdate + '&mail=' + queryMail,
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
