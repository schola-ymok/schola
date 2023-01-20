import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  var data;
  var error;

  async function updateReviewStastics(textId) {
    const { data: dataCount, error: errorCount } = await dbQuery(escape`
    select rate, count(*) as cnt from reviews where text_id = ${textId} group by rate`);

    if (errorCount) return;

    const sumCount = dataCount.reduce((a, x) => {
      return a + x.cnt;
    }, 0);
    const sumRate = dataCount.reduce((a, x) => {
      return a + x.rate * x.cnt;
    }, 0);

    const avg = (sumRate / sumCount).toFixed(1);

    var r1 = 0,
      r2 = 0,
      r3 = 0,
      r4 = 0,
      r5 = 0;

    dataCount.map((item) => {
      const ratio = Math.floor((item.cnt / sumCount) * 100);
      if (item.rate == 1) r1 = ratio;
      if (item.rate == 2) r2 = ratio;
      if (item.rate == 3) r3 = ratio;
      if (item.rate == 4) r4 = ratio;
      if (item.rate == 5) r5 = ratio;
    });

    await dbQuery(escape`update texts set number_of_reviews = ${sumCount},
    rate_ratio_1 = ${r1},
    rate_ratio_2 = ${r2},
    rate_ratio_3 = ${r3},
    rate_ratio_4 = ${r4},
    rate_ratio_5 = ${r5},
    rate = ${avg} where id = ${textId}
    `);
  }

  switch (req.method) {
    case 'GET': // get reviews
      if (req.query.mine !== undefined) {
        if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

        const { data, error } = await dbQuery(escape`
        select
        reviews.id, user_id, users.display_name as user_display_name,
        users.photo_id as user_photo_id,
        text_id, title, rate, comment, updated_at
        from reviews
        inner join users on reviews.user_id = users.id
        where
        text_id = ${req.query.text_id} and
        user_id = ${req.headers.user_id}
        `);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        if (data.length == 0) {
          return res.status(200).json({
            exists: false,
          });
        } else {
          return res.status(200).json({
            exists: true,
            review: data[0],
          });
        }
      } else {
        const page =
          Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page - 1 : 0;
        const offset = page * Consts.SELECT_LIMIT;
        const rate = Number(req.query.rate);
        const rateFilter = Number.isInteger(rate) ? escape` and rate=${rate} ` : '';

        const countQuery = escape`select count(*) as cnt from reviews where text_id = ${req.query.text_id}`;
        countQuery.append(rateFilter);
        const selectQuery = escape`
          select
          reviews.id, user_id, users.display_name as user_display_name,
          users.photo_id as user_photo_id,
          text_id, title, rate, comment, updated_at
          from reviews
          inner join users on reviews.user_id = users.id
          where
          text_id = ${req.query.text_id}`;
        selectQuery
          .append(rateFilter)
          .append(`order by updated_at desc limit ${Consts.SELECT_LIMIT} offset ${offset}`);

        const { data: dataCount, error: errorCount } = await dbQuery(countQuery);
        const { data: dataGet, error: errorGet } = await dbQuery(selectQuery);

        if (errorGet || errorCount)
          return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        let is_mine_exists = false;

        if (verify) {
          const countMineQuery = escape`select count(*) as cnt from reviews where text_id = ${req.query.text_id} and user_id=${req.headers.user_id}`;
          const { data: dataMineCount, error: errorMineCount } = await dbQuery(countMineQuery);
          if (dataMineCount[0].cnt == 1) {
            is_mine_exists = true;
          }
        }

        return res.status(200).json({
          total: dataCount[0].cnt,
          page: page,
          is_mine_exists: is_mine_exists,
          reviews: dataGet,
        });
      }

    case 'DELETE': // delete review
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end(`not authorized`);

      const { data: dataDelete, error: errorDelete } = await dbQuery(escape`
      delete from reviews
        where
        text_id = ${req.query.text_id}
        and
        user_id = ${req.headers.user_id}
      `);

      error = errorDelete;
      data = dataDelete;

      break;

    case 'POST': // add review
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const title = req.body.title;
      const comment = req.body.comment;
      const rate = Number(req.body.rate);

      if (
        isEmptyString(title) ||
        isEmptyString(comment) ||
        !(Number.isInteger(rate) && rate >= 1 && rate <= 5)
      )
        return res.status(Consts.HTTP_BAD_REQUEST).json('bad parameter');

      const reviewId = genid();
      const { data: dataPost, error: errorPost } = await dbQuery(escape`
      insert into reviews (
        id,
        title,
        user_id,
        text_id,
        comment,
        rate
      ) values (
        ${reviewId},
        ${title},
        ${req.headers.user_id},
        ${req.query.text_id},
        ${comment},
        ${rate}
      )
      on duplicate key update
      title = ${title},
      comment = ${comment},
      rate = ${rate}
      `);

      error = errorPost;
      data = dataPost;
      break;

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }

  if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

  if (data.affectedRows == 0)
    return res
      .status(Consts.HTTP_BAD_REQUEST)
      .end('review does not exist or you are not the user who posted');

  updateReviewStastics(req.query.text_id);
  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
