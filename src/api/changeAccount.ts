export const changeAccount = async (accountName, authAxios) => {
  try {
    const res = await authAxios.put('/api/account?changeaccount', {
      account_name: accountName,
    });

    if (res.data.status == 'ok') {
      return { status: 'ok' };
    } else if (res.data.status == 'duplicate') {
      return { duplicate: true };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
