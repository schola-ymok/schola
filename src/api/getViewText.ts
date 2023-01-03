import axios from 'axios';

export const getViewText = async (textId) => {
  //try {
  let url = '/api/texts/' + textId + '/view';

  const res = await axios.get(url);
  return res.data;
  //} catch (error) {
  // return { error: error };
  // }
};
