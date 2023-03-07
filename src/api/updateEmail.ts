export const updateEmail = async (email, emailVerified, authAxios) => {
  try {
    const res = await authAxios.put('/api/account/?updateemail=1', {
      email: email,
      emailVerified: emailVerified,
    });

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
