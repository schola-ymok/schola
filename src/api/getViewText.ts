export const getViewText = async (textId, authAxios) => {
  //try {
  let url = '/api/texts/' + textId + '/view';

  const res = await authAxios.get(url);
  return res.data;
  //} catch (error) {
  // return { error: error };
  // }
};
