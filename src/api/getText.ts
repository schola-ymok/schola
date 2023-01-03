import axios from 'axios';

export const getText = async (textId) => {
  //try {
  let url = '/api/texts/' + textId;

  const res = await axios.get(url);
  return res.data;
  //} catch (error) {
  // return { error: error };
  // }
};
