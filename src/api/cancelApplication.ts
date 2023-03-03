export const cancelApplication = async (id, authAxios) => {
  try {
    const res = await authAxios.put('/api/texts/' + id + '?cancelreview');

    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
