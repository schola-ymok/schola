export const setTextCoverPhotoId = async (authAxios, textId, id) => {
  try {
    const res = await authAxios.put('/api/texts/' + textId + '/?photo_id=' + id);

    if (res.data.status == 'ok') {
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    return { error: error };
  }
};
