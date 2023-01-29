import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET': // get user
      if (req.query.brf !== undefined) {
        const { data: dataBrief, error: errorBrief } = await dbQuery(escape`
        select id,display_name, account_name,photo_id from users
        where
        id=${req.query.user_id}`);

        if (errorBrief) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        if (dataBrief.length > 0) {
          return res.status(Consts.HTTP_OK).json(dataBrief[0]);
        } else {
          return res.status(Consts.HTTP_BAD_REQUEST).end('user does not exist');
        }
      } else {
        const { data: dataCountTexts, error: errorCountTexts } = await dbQuery(escape`
        select count(*) as cnt from texts where author_id=${req.query.user_id} and is_public=true`);

        const { data: dataCountReviews, error: errorCountReviews } = await dbQuery(escape`
        select count(*) as cnt from reviews
        inner join texts on reviews.text_id = texts.id
        inner join users on texts.author_id = users.id where users.id= ${req.query.user_id}`);

        const { data: dataCountSales, error: errorCountSales } = await dbQuery(escape`
        select count(*) as cnt from purchases
        inner join texts on purchases.text_id = texts.id
        inner join users on texts.author_id = users.id where users.id= ${req.query.user_id}`);

        const { data: dataGet, error: errorGet } = await dbQuery(escape`
        select * from users
        where
        id=${req.query.user_id}`);

        if (errorGet || errorCountTexts || errorCountReviews || errorCountSales)
          return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        if (dataGet.length > 0) {
          dataGet[0].num_of_texts = dataCountTexts[0].cnt;
          dataGet[0].num_of_reviews = dataCountReviews[0].cnt;
          dataGet[0].num_of_sales = dataCountSales[0].cnt;
          return res.status(Consts.HTTP_OK).json(dataGet[0]);
        } else {
          return res.status(Consts.HTTP_BAD_REQUEST).end('user does not exist');
        }
      }

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
