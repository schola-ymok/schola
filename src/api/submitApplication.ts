export const submitApplication = async (id, authAxios) => {
  try {
    const res = await authAxios.put('/api/texts/' + id + '?reqreview');

    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
