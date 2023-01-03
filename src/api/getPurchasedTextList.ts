export const getPurchasedTextList = async (authAxios, page) => {
  try {
    let url = '/api/account/texts?page=' + page;

    const res = await authAxios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
