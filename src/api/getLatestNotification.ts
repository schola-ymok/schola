export const getLatestNotification = async (authAxios) => {
  const url = '/api/notices?latest';

  const res = await authAxios.get(url);

  return res.data;
};
