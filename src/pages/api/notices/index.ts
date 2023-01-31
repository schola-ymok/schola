import error from 'next/error';
import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

  switch (req.method) {
    case 'GET': // get notices
      if (req.query.unreadcount !== undefined) {
        const checkQuery = escape`select count(*) as cnt from notices where user_id = ${req.headers.user_id} and readed = false`;

        const { data: dataCheck, error: errorCheck } = await dbQuery(checkQuery);
        if (errorCheck) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(200).json({
          total: dataCheck[0].cnt,
        });
      } else {
        const page =
          Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page - 1 : 0;

        const offset = req.query.latest !== undefined ? 0 : page * Consts.SELECT_LIMIT;
        const limit = req.query.latest !== undefined ? 5 : Consts.SELECT_LIMIT;

        const countQuery = escape`select count(*) as cnt from notices where user_id = ${req.headers.user_id}`;

        const selectQuery = escape`
          select
          *
          from notices
          where
          user_id = ${req.headers.user_id}
          order by created_at desc limit ${limit} offset ${offset}`;

        const updateQuery = escape`update notices set readed = true where user_id = ${req.headers.user_id}`;

        const { data: dataCount, error: errorCount } = await dbQuery(countQuery);
        const { data: dataGet, error: errorGet } = await dbQuery(selectQuery);

        if (errorGet || errorCount)
          return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        await dbQuery(updateQuery);

        return res.status(200).json({
          total: dataCount[0].cnt,
          page: page,
          notices: dataGet,
        });
      }

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
