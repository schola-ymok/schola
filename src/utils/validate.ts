export const validate = (value, mm) => {
  if (value == null || value == undefined || value.length < mm.min) {
    return { ok: false, message: mm.min + '文字未満です' };
  }

  if (value.length > mm.max) {
    return { ok: false, message: mm.max + '文字を超過しています' };
  }

  return { ok: true, message: 'OK' };
};
