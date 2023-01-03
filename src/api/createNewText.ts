export const createNewText = async (title, authAxios) => {
  try {
    const res = await authAxios.post('/api/texts', {
      title: title,
    });

    console.log(res.data);
    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
