export const validate = (value, mm) => {
  if (value == null || value == undefined || value.length < mm.min) {
    return { ok: false, message: mm.min + '文字以上で入力してください' };
  }

  if (value.length > mm.max) {
    return { ok: false, message: mm.max + '文字以下で入力してください' };
  }

  return { ok: true, message: 'OK' };
};
