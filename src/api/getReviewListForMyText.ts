// 自分の書いたテキストに対するレビューを取得

export const getReviewListForMyText = async (authAxios, page) => {
  try {
    let url = '/api/dashboard/reviews?page=' + page;

    const res = await authAxios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
