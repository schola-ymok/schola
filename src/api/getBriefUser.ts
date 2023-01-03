import axios from 'axios';

export const getBriefUser = async (userId) => {
  try {
    const res = await axios.get('/api/users/' + userId + '?brf=1');

    return {
      userId: res.data.id,
      displayName: res.data.display_name,
      accountName: res.data.account_name,
      photoId: res.data.photo_id,
    };
  } catch (error) {
    return { error: error };
  }
};
