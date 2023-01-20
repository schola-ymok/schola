import axios from 'axios';

export const getReviews = async (textId, params, authAxios) => {
  try {
    const url = `/api/texts/${textId}/reviews?` + new URLSearchParams(params).toString();
    const res = authAxios !== undefined ? await authAxios.get(url) : await axios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
