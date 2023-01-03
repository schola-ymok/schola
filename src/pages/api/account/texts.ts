import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import escape from 'sql-template-strings';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  if (!verify) return res.status(Consts.HTTP_FORBIDDEN).end();

  switch (req.method) {
    case 'GET': // get purchased texts
      const page =
        Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page : 0;
      const offset = page * Consts.SELECT_LIMIT;

      const { data: dataCount, error: errorCount } =
        await dbQuery(escape`select count(*) as cnt from purchases
          where user_id = ${req.headers.user_id}`);

      const { data, error } = await dbQuery(escape`select
        texts.id, title, substring(abstract,128) as abstract, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, updated_at, is_released, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5, purchases.created_at as purchased_at
        from texts
        inner join purchases on texts.id = purchases.text_id
        inner join users on texts.author_id = users.id
        where purchases.user_id =${req.headers.user_id}
        order by purchases.created_at desc limit ${Consts.SELECT_LIMIT} offset ${offset}`);

      if (error || errorCount) res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end();

      return res.status(200).json({
        total: dataCount[0].cnt,
        page: page,
        texts: data,
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end();
  }
}
