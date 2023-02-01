export const getNotifications = async (authAxios, page) => {
  const url = `/api/notices?page=` + page;
  const res = await authAxios.get(url);

  return res.data;
};
