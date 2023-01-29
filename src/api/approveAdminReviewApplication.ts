export const approveAdminReviewApplication = async (authAxios, id) => {
  try {
    let url = '/api/admin/applications?approve&id=' + id;

    const res = await authAxios.put(url);

    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
