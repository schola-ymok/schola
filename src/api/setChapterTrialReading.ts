export const setChapterTrialReading = async (id, isAvailable, authAxios) => {
  try {
    const res = await authAxios.put('/api/chapters/' + id + '?trial', {
      trial: isAvailable,
    });

    if (res.data.status == 'ok') {
      return { status: 'ok' };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
