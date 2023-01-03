export const getPerformance = async (authAxios) => {
  try {
    let url = '/api/dashboard/performance';

    const res = await authAxios.get(url);

    return res.data;
  } catch (error) {
    return { error: error };
  }
};
