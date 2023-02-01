import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import { notifyBanned } from 'libs/notify';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

  let data, error;

  switch (req.method) {
    case 'PUT':
      if (req.query.text_id !== undefined) {
        if (req.body.reason_text === undefined)
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        const { data: dataTextBan, error: errorTextBan } = await dbQuery(escape`
          update texts
          set
          state = ${Consts.TEXTSTATE.DraftBanned},
          notice = ${req.body.reason_text}
          where id = ${req.query.text_id}
          and
          state = ${Consts.TEXTSTATE.Selling}
          `);

        data = dataTextBan;
        error = errorTextBan;

        notifyBanned(req.query.text_id);
      } else if (req.query.user_id !== undefined) {
        const { data: dataUserBan, error: errorUserBan } = await dbQuery(escape`
          update users
          set
          banned = ${true}
          where id = ${req.query.user_id}`);
        data = dataUserBan;
        error = errorUserBan;
      }
      break;

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }

  if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

  if (data.affectedRows == 0) return res.status(Consts.HTTP_BAD_REQUEST).end('not exist');

  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
