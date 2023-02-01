import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import { notifyPurchase } from 'libs/notify';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  const { data: dataAuthorId, error: errorAuthorId } = await dbQuery(escape`
    select author_id from texts where id=${req.query.text_id}`);

  if (errorAuthorId) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

  switch (req.method) {
    case 'GET': // get purchase info
      if (!verify) return res.status(Consts.HTTP_OK).json({ purchased: false, yours: false });

      const { data: dataRecord, error: errorRecord } = await dbQuery(escape`
        select exists( select 1 from purchases
          where text_id=${req.query.text_id}
          and user_id=${req.headers.user_id} ) as cnt`);

      if (errorRecord) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataRecord.length == 0 || dataAuthorId.length == 0)
        return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist');

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
        purchased: dataRecord[0].cnt == 0 ? false : true,
        yours: dataAuthorId[0].author_id == req.headers.user_id ? true : false,
      });

    case 'POST': // puchase text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      if (dataAuthorId[0].author_id == req.headers.user_id)
        return res.status(Consts.HTTP_BAD_REQUEST).end('can not purchase self-written text');

      const { error } = await dbQuery(escape`
      insert into purchases (
        user_id,
        text_id
      ) values (
        ${req.headers.user_id},
        ${req.query.text_id}
      )`);

      if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      const { data: dataCount, error: errorCount } = await dbQuery(escape`
    select count(*) as cnt from purchases where text_id = ${req.query.text_id}`);

      if (!errorCount) {
        if (dataCount.length == 1) {
          await dbQuery(
            escape`update texts set number_of_sales = ${dataCount[0].cnt} where id = ${req.query.text_id}`,
          );
          notifyPurchase(req.query.text_id);
        }
      }

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end('method not allowed');
  }
}
