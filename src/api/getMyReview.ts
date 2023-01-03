export const getMyReview = async (textId, authAxios) => {
  try {
    const res = await authAxios.get(`/api/texts/${textId}/reviews?mine`);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
