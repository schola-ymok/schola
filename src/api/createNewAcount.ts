export const createNewAccount = async (accountName, displayName, authAxios) => {
  try {
    const res = await authAxios.post('/api/account', {
      account_name: accountName,
      display_name: displayName,
    });

    console.log(res.data);
    if (res.data.status == 'ok') {
      return { userId: res.data.user_id };
    } else if (res.data.status == 'exists') {
      return { exists: res.data.user_id };
    } else if (res.data.status == 'duplicate') {
      return { duplicate: true };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
