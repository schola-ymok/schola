export const getTocs = async (textId, authAxios) => {
  //try {
  let url = '/api/texts/' + textId + '/toc';

  const res = await authAxios.get(url);
  return res.data;
  //} catch (error) {
  // return { error: error };
  // }
};
