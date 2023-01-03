import error from 'next/error';

export const deleteText = async (textId, authAxios) => {
  try {
    const res = await authAxios.delete(`/api/texts/${textId}`);

    if (res.data.status == 'ok') {
      return { data: { status: 'ok' } };
    } else {
      return { error: error };
    }
  } catch (error) {
    return { error: error };
  }
};
