import axios from 'axios';

export const getChapterList = async (textId) => {
  try {
    let url = '/api/texts/' + textId + '/chapters';

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
