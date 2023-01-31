import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import { getAuthorIdFromTextId } from 'libs/getAuthorIdFromTextId';
import { notify } from 'libs/notify';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

  let data, error;

  switch (req.method) {
    case 'GET': // get review applications
      const page =
        Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page : 0;
      const offset = page * Consts.SELECT_LIMIT;

      const { data: dataCount, error: errorCount } =
        await dbQuery(escape`select count(*) as cnt from texts 
          where state = ${Consts.TEXTSTATE.UnderReview}`);

      const { data: dataGet, error: errorGet } = await dbQuery(escape`
          select
          texts.id, updated_at, title, author_id, users.display_name as author_display_name
          from texts
          inner join users on texts.author_id = users.id
          where state=${Consts.TEXTSTATE.UnderReview}
          order by updated_at desc limit ${Consts.SELECT_LIMIT} offset ${offset}
          `);

      if (errorGet || errorCount) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(200).json({
        total: dataCount[0].cnt,
        page: page,
        texts: dataGet,
      });

    case 'PUT':
      if (req.query.approve !== undefined) {
        if (req.query.id === undefined)
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        const { data: dataApprove, error: errorApprove } = await dbQuery(escape`
          update texts
          set
          state = ${Consts.TEXTSTATE.Selling}
          where id = ${req.query.id}
          `);

        const { authorId } = await getAuthorIdFromTextId(req.query.id);
        if (authorId) {
          notify(authorId, 'noticeCheck', 'http://schola.jp');
        }

        data = dataApprove;
        error = errorApprove;
      } else if (req.query.reject !== undefined) {
        if (req.body.reason_text === undefined)
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        const { data: dataReject, error: errorReject } = await dbQuery(escape`
          update texts
          set
          state = ${Consts.TEXTSTATE.DraftRejected},
          notice = ${req.body.reason_text}
          where id = ${req.query.id}
          `);

        data = dataReject;
        error = errorReject;
      }
      break;

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
  if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

  if (data.affectedRows == 0)
    return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist or you are not author');

  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
