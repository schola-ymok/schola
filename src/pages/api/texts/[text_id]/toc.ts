import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  switch (req.method) {
    case 'GET': // get text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const getTextInfoQuery = escape`select is_public, title, author_id, users.display_name as author_display_name, chapter_order from texts inner join users on texts.author_id = users.id where texts.id=${req.query.text_id}`;

      const getChaptersQuery = escape`select id, title, is_trial_reading_available, toc from chapters where text_id = ${req.query.text_id}`;

      const { data: dataText, error: errorText } = await dbQuery(getTextInfoQuery);
      const { data: dataChapters, error: errorChapters } = await dbQuery(getChaptersQuery);

      if (errorText || errorChapters)
        return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataText.length > 0) {
        if (!dataText[0].is_public && dataText[0].author_id != req.headers.user_id) {
          return res.status(Consts.HTTP_BAD_REQUEST).end('text not released');
        }

        var chapters = {};
        for (var i = 0; i < dataChapters.length; i++) {
          const id = dataChapters[i].id;
          chapters[[id]] = dataChapters[i];
        }

        dataText[0].chapters = chapters;

        return res.status(Consts.HTTP_OK).json(dataText[0]);
      } else {
        return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist');
      }

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end(`method not allowed`);
  }
}
