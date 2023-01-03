import axios from 'axios';

export const getTextList = async (params) => {
  try {
    const url = '/api/texts?' + new URLSearchParams(params).toString();

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
