import error from 'next/error';

export const upsertReview = async (textId, title, rate, comment, authAxios) => {
  try {
    const res = await authAxios.post(`/api/texts/${textId}/reviews`, {
      title: title,
      rate: rate,
      comment: comment,
    });

    if (res.data.status == 'ok') {
      return { data: { status: 'ok' } };
    } else {
      return { error: error };
    }
  } catch (error) {
    return { error: error };
  }
};
