export const purchaseText = async (textId, authAxios) => {
  try {
    const res = await authAxios.post(`/api/purchase/${textId}`);

    if (res.data.status == 'ok') {
      return { status: 'ok' };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
