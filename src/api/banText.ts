export const banText = async (authAxios, textId, reasonText) => {
  try {
    let url = `/api/admin/ban?text_id=${textId}`;

    const res = await authAxios.put(url, {
      reason_text: reasonText,
    });
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
