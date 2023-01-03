import axios from 'axios';

export const getReviews = async (textId, params) => {
  try {
    const url = `/api/texts/${textId}/reviews?` + new URLSearchParams(params).toString();
    console.log(url);
    const res = await axios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
