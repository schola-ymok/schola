export const createNewChapter = async (textId, authAxios, title) => {
  try {
    const res = await authAxios.post('/api/texts/' + textId + '/chapters/', {
      title: title,
    });

    if (res.data.status == 'ok') {
      return { chapterId: res.data.chapter_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
