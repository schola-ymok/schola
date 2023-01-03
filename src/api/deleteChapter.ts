export const deleteChapter = async (chapterId, authAxios) => {
  try {
    let url = '/api/chapters/' + chapterId;

    const res = await authAxios.delete(url);
    return res.data;
  } catch (error) {
    return { error: error };
  }
};
