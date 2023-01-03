import axios from 'axios';

export const getReview = async (textId, reviewId) => {
  try {
    const res = await axios.get(`/api/texts/${textId}/reviews/${reviewId}`);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
