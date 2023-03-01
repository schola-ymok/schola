export const getPurchasedInfo = async (textId, authAxios) => {
  try {
    let url = '/api/purchase/' + textId;

    const res = await authAxios.get(url);
    if (res.data.status == 'ok') {
      return res.data;
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
