export const rejectAdminReviewApplication = async (authAxios, id, reasonText) => {
  try {
    let url = '/api/admin/applications?reject&id=' + id;

    const res = await authAxios.put(url, {
      reason_text: reasonText,
    });

    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
