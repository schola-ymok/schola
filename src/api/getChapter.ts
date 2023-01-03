export const getChapter = async (chapterId, authAxios) => {
  try {
    let url = '/api/chapters/' + chapterId;

    const res = await authAxios.get(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
