export const setEmailVerified = async (authAxios) => {
  try {
    const res = await authAxios.put('/api/account/?emailverified');

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
