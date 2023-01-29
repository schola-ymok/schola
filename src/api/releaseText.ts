export const releaseText = async (id, isRelease, authAxios) => {
  try {
    const res = await authAxios.put('/api/texts/' + id + '?rls=1', {
      is_public: isRelease,
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
