import axios from 'axios';

export const getUserTexts = async (userId, page) => {
  try {
    const res = await axios.get('/api/users/' + userId + '/texts?page=' + page);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
