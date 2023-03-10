import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);

  const checkAuthor = async (authorId) => {
    const { data, error } = await dbQuery(escape`
      select author_id from texts 
      where id=${req.query.text_id}`);

    if (error) return false;
    if (data.length == 0) return false;

    if (data[0].author_id == authorId) return true;

    return false;
  };

  switch (req.method) {
    case 'GET': // get chapters
      const { data: dataGet, error: errorGet } = await dbQuery(escape`
      select chapters.id as id, chapters.title as title, is_trial_reading_available, number_of_characters from chapters
      where text_id=${req.query.text_id}`);

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      const { data: dataGetChapterOrder, error: errorGetChapterOrder } = await dbQuery(escape`
      select chapter_order from texts
      where id=${req.query.text_id}`);

      if (errorGetChapterOrder) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      /*
      if (dataGet.length == 0)
        return res.status(Consts.HTTP_BAD_REQUEST).end('chapter does not exist');
      */

      return res
        .status(Consts.HTTP_OK)
        .json({ chapters: dataGet, chapter_order: dataGetChapterOrder[0].chapter_order });

    case 'POST': // add new chapter
      if (!verify || !(await checkAuthor(req.headers.user_id)))
        return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');
      const title = req.body.title;

      if (isEmptyString(title)) return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

      const { data: _dataGetChapterOrder, error: _errorGetChapterOrder } = await dbQuery(escape`
      select chapter_order from texts
      where id=${req.query.text_id}`);

      if (_errorGetChapterOrder) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      const chapterId = genid();
      const { error: errorPost } = await dbQuery(escape`
      insert into chapters(
        id,
        text_id,
        title,
        is_trial_reading_available
      ) values (
        ${chapterId},
        ${req.query.text_id},
        ${title},
        false
      )`);

      if (errorPost) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      let _chapterOrder = [];
      if (_dataGetChapterOrder[0].chapter_order != null) {
        _chapterOrder = JSON.parse(_dataGetChapterOrder[0].chapter_order);
      }

      _chapterOrder.push(chapterId);

      const { data: dataUpdateChapterOrder, error: errorUpdateChapterOrder } =
        await dbQuery(escape` update texts set chapter_order=${JSON.stringify(_chapterOrder)}
      where id =${req.query.text_id}`);

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
        chapter_id: chapterId,
      });

    case 'PUT':
      if (!verify || !(await checkAuthor(req.headers.user_id)))
        return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const chapterOrder = req.body.chapter_order;

      if (isEmptyString(chapterOrder))
        return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

      const { data: dataUpdate, error: errorUpdate } = await dbQuery(escape`
        update texts
        set
        chapter_order = ${chapterOrder}
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
      `);

      if (errorUpdate) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataUpdate.affectedRows == 0)
        return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist or you are not author');

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end('method not allowed');
  }
}
