import Consts from 'utils/Consts';

export const pagenation = (total, page, len) => {
  const count = Math.ceil(total / Consts.SELECT_LIMIT);
  const from = (page - 1) * Consts.SELECT_LIMIT + 1;
  const to = from + len - 1;
  //  console.log('from=' + from + ' page=' + page + ' len=' + len);
  return {
    count: count,
    from: from,
    to: to,
  };
};
