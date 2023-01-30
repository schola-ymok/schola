export const getMyBriefAccount = async (authAxios) => {
  try {
    const res = await authAxios.get('/api/account?prl=1');
    console.log(res);

    return {
      data: {
        userId: res.data.id,
        banned: res.data.banned,
        accountName: res.data.account_name,
        displayName: res.data.display_name,
        photoId: res.data.photo_id,
      },
    };
  } catch (error) {
    return { error: error };
  }
};
