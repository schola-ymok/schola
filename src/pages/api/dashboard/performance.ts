import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  switch (req.method) {
    case 'GET': // get performance
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const { data: dataTexts, error: errorTexts } = await dbQuery(escape`
        select id, title, number_of_reviews, number_of_sales
        from texts where is_public = true and
        author_id = ${req.headers.user_id}
      `);

      if (errorTexts) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      let totalTextCount = dataTexts.length;
      let totalReviewCount = 0;
      let totalSalesCount = 0;

      for (let i = 0; i < dataTexts.length; i++) {
        totalReviewCount += dataTexts[i].number_of_reviews;
        totalSalesCount += dataTexts[i].number_of_sales;
      }

      return res.status(200).json({
        number_of_total_texts: totalTextCount,
        number_of_total_reviews: totalReviewCount,
        number_of_total_sales: totalSalesCount,
        texts: dataTexts,
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
