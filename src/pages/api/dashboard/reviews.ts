import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  switch (req.method) {
    case 'GET': // get reviews
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const page =
        Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page : 0;
      const offset = page * Consts.SELECT_LIMIT;

      const { data: dataCount, error: errorCount } =
        await dbQuery(escape`select count(*) as cnt from reviews
          inner join texts on reviews.text_id = texts.id
          where texts.author_id=${req.headers.user_id}`);

      const { data: dataGet, error: errorGet } = await dbQuery(escape`
        select \
        reviews.id as id, user_id, users.display_name as user_display_name,
        text_id, reviews.title, reviews.rate, comment, reviews.updated_at
        from reviews
        inner join users on reviews.user_id = users.id
        inner join texts on reviews.text_id = texts.id
        where texts.author_id=${req.headers.user_id}
        order by reviews.updated_at desc limit ${Consts.SELECT_LIMIT} offset ${offset}
        `);

      if (errorGet || errorCount) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(200).json({
        total: dataCount[0].cnt,
        page: page,
        reviews: dataGet,
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
