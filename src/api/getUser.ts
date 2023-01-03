import axios from 'axios';

export const getUser = async (userId) => {
  try {
    const res = await axios.get('/api/users/' + userId);

    return res.data;
    /*
    return {
      userId: res.data.id,
      numOfTexts: res.data.num_of_texts,
      numOfReviews: res.data.num_of_reviews,
      displayName: res.data.display_name,
      profileMessage: res.data.profile_message,
      majors: res.data.majors,
      twitter: res.data.twitter,
      web: res.data.web,
      facebook: res.data.facebook,
    };
    */
  } catch (error) {
    return { error: error };
  }
};
