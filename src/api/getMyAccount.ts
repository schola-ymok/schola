export const getMyAccount = async (authAxios) => {
  try {
    const res = await authAxios.get('/api/account/');

    return {
      userId: res.data.id,
      displayName: res.data.display_name,
      profileMessage: res.data.profile_message,
      notifyOnPurchase: res.data.notify_on_purchase,
      notifyOnReview: res.data.notify_on_review,
      majors: res.data.majors,
      twitter: res.data.twitter,
      web: res.data.web,
      facebook: res.data.facebook,
    };
  } catch (error) {
    return { error: error };
  }
};
