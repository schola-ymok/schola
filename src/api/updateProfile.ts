export const updateProfile = async (authAxios, profile) => {
  try {
    const res = await authAxios.put('/api/account', {
      display_name: profile.displayName,
      profile_message: profile.profileMessage,
      majors: profile.majors,
      twitter: profile.twitter,
      web: profile.web,
      facebook: profile.facebook,
    });

    if (res.data.status == 'ok') {
      return {};
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
