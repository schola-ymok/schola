import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  switch (req.method) {
    case 'GET': // get texts
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const page =
        Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page : 0;
      const offset = page * Consts.SELECT_LIMIT;

      const { data: dataCount, error: errorCount } =
        await dbQuery(escape`select count(*) as cnt from texts 
          where author_id = ${req.headers.user_id}`);

      const { data: dataGet, error: errorGet } = await dbQuery(escape`
          select
          texts.id, title, texts.photo_id as photo_id, substring(abstract,128) as abstract, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, updated_at, is_public, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5
          from texts
          inner join users on texts.author_id = users.id
          where author_id=${req.headers.user_id}
          order by updated_at desc limit ${Consts.SELECT_LIMIT} offset ${offset}
          `);

      if (errorGet || errorCount) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(200).json({
        total: dataCount[0].cnt,
        page: page,
        texts: dataGet,
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
