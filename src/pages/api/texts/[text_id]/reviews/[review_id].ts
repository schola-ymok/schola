import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  var data;
  var error;

  switch (req.method) {
    case 'GET': // get review
      const { data: dataGet, error: errorGet } = await dbQuery(escape`
      select
      reviews.id, user_id, users.display_name as user_display_name,
      text_id, title, rate, comment, updated_at
      from reviews
      inner join users on reviews.user_id = users.id
      where
      reviews.id = ${req.query.review_id} and
      text_id = ${req.query.text_id}
      `);

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataGet.length == 0)
        return res.status(Consts.HTTP_BAD_REQUEST).end('review does not exist');

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(Consts.HTTP_OK).json(dataGet[0]);

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end('method not allowed');
  }
}
