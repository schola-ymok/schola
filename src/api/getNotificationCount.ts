export const getNotificationCount = async (authAxios) => {
  try {
    let url = '/api/notices?unreadcount';

    const res = await authAxios.get(url);
    return { data: res.data };
  } catch (error) {
    return { error: error };
  }
};
