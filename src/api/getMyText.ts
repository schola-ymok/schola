export const getMyText = async (textId, authAxios) => {
  try {
    let url = '/api/texts/' + textId;

    const res = await authAxios.get(url);

    if (res.data.abstract == null) res.data.abstract = '';
    if (res.data.category1 == null) res.data.category1 = 'nul';
    if (res.data.category2 == null) res.data.category2 = 'nul';
    if (res.data.price == null) res.data.price = 0;

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
