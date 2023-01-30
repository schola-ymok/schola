export const banUser = async (authAxios, userId) => {
  try {
    let url = `/api/admin/ban?user_id=${userId}`;

    const res = await authAxios.put(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
