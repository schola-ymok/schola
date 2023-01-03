export const updateChapter = async (id, title, content, authAxios) => {
  try {
    const res = await authAxios.put('/api/chapters/' + id, {
      title: title,
      content: content,
    });

    console.log(res.data);
    if (res.data.status == 'ok') {
      return { chapterId: res.data.chapter_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
