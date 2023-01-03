import axios from 'axios';

export const getBriefText = async (textId) => {
  try {
    let url = '/api/texts/' + textId + '?brf=1';

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
