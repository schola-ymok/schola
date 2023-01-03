export const setProfilePhotoId = async (authAxios, id) => {
  try {
    const res = await authAxios.put('/api/account/?photo_id=' + id);

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
