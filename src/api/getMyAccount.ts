export const getMyAccount = async (authAxios) => {
  try {
    const res = await authAxios.get('/api/account/');

    return {
      userId: res.data.id,
      displayName: res.data.display_name,
      profileMessage: res.data.profile_message,
      notifyOnPurchaseWeb: res.data.notify_on_purchase_web,
      notifyOnReviewWeb: res.data.notify_on_review_web,
      notifyOnUpdateWeb: res.data.notify_on_update_web,
      notifyOnPurchaseMail: res.data.notify_on_purchase_mail,
      notifyOnReviewMail: res.data.notify_on_review_mail,
      notifyOnUpdateMail: res.data.notify_on_update_mail,
      majors: res.data.majors,
      twitter: res.data.twitter,
      web: res.data.web,
      facebook: res.data.facebook,
    };
  } catch (error) {
    return { error: error };
  }
};
