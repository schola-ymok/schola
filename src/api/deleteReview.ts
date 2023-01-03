import error from 'next/error';

export const deleteReview = async (textId, authAxios) => {
  try {
    const res = await authAxios.delete(`/api/texts/${textId}/reviews`);

    if (res.data.status == 'ok') {
      return { data: { status: 'ok' } };
    } else {
      return { error: error };
    }
  } catch (error) {
    return { error: error };
  }
};
