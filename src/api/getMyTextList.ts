export const getMyTextList = async (authAxios, page) => {
  try {
    let url = '/api/dashboard/texts?page=' + page;

    const res = await authAxios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
