export const updateChapterOrder = async (id, chapterOrder, authAxios) => {
  try {
    const res = await authAxios.put('/api/texts/' + id + '?chapter_order', {
      chapter_order: chapterOrder,
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
