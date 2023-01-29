export const getAdminReviewApplicationList = async (authAxios, page) => {
  try {
    let url = '/api/admin/applications?page=' + page;

    const res = await authAxios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
