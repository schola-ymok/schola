import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  var data;
  var error;

  const isTrialReadingAvailable = async () => {
    const { data, error } = await dbQuery(escape`
    select is_trial_reading_available from chapters 
    where id=${req.query.chapter_id}`);

    if (error) return false;
    if (data.length == 0) return false;

    if (data[0].is_trial_reading_available == 1) return true;
    return false;
  };

  const amIAuthor = async () => {
    const { data, error } = await dbQuery(escape`
    select author_id
    from chapters 
    inner join texts on chapters.text_id = texts.id
    where chapters.id=${req.query.chapter_id}`);

    if (error) return false;
    if (data.length == 0) return false;

    if (data[0].author_id == req.headers.user_id) return true;
    console.log('fals');

    return false;
  };

  const getTextId = async () => {
    const { data, error } = await dbQuery(escape`
    select text_id from chapters where id = ${req.query.chapter_id}`);

    if (error) return false;
    if (data.length == 0) return false;

    return data[0].text_id;
  };

  const haveIPurchased = async () => {
    const textId = await getTextId();

    if (!textId) return false;

    const { data, error } = await dbQuery(escape`
    select count(*) as cnt from purchases where user_id=${req.headers.user_id} and text_id = ${textId}`);

    if (error) return false;
    if (data.length == 0) return false;

    if (data[0].cnt > 0) return true;

    return false;
  };

  switch (req.method) {
    case 'GET': // get chapter
      if (!(await isTrialReadingAvailable())) {
        if (!verify || (!(await amIAuthor()) && !(await haveIPurchased())))
          return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');
      }

      const { data: dataGet, error: errorGet } = await dbQuery(escape`
      select text_id,content,chapters.title,is_trial_reading_available,chapters.updated_at
      from chapters where id=${req.query.chapter_id}`);

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataGet.length == 0)
        return res.status(Consts.HTTP_BAD_REQUEST).end('chapter does not exist');

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(Consts.HTTP_OK).json(dataGet[0]);

    case 'PUT':
      if (!verify || !(await amIAuthor()))
        return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      if (
        req.body.title === undefined &&
        req.body.content === undefined &&
        req.body.trial === undefined
      ) {
        res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');
      }

      let query = escape`
        update chapters
        inner join texts on chapters.text_id = texts.id
        set`;

      let comma = false;

      if (req.body.title !== undefined) {
        const title = req.body.title;
        if (isEmptyString(title)) return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');
        query = query.append(escape` chapters.title = ${title}`);
        comma = true;
      }

      if (req.body.content !== undefined) {
        const content = req.body.content;
        if (comma) query = query.append(',');
        query = query.append(escape` content = ${content}`);
        comma = true;
      }

      if (req.body.trial !== undefined) {
        const trial = req.body.trial == true ? true : false;
        if (comma) query = query.append(',');
        query = query.append(escape` is_trial_reading_available = ${trial}`);
      }

      query = query.append(escape`
        where
        chapters.id = ${req.query.chapter_id}
        and
        texts.author_id = ${req.headers.user_id}
      `);

      const { data: dataUpdate, error: errorUpdate } = await dbQuery(query);

      error = errorUpdate;
      data = dataUpdate;
      break;

    case 'DELETE': // delete chapter
      if (!verify || !(await amIAuthor()))
        return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      const chapterId = req.query.chapter_id;

      const { data: dataGetTextId, error: errorGetTextId } = await dbQuery(
        escape`select text_id from chapters where id=${chapterId}`,
      );

      if (errorGetTextId) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      const textId = dataGetTextId[0].text_id;

      const { data: dataDelete, error: errorDelete } = await dbQuery(escape`
      delete a from chapters a
        inner join texts b on a.text_id = b.id
        where
        a.id = ${req.query.chapter_id}
        and
        b.author_id = ${req.headers.user_id}
      `);

      const { data: dataGetChapterOrder, error: errorGetChapterOrder } = await dbQuery(
        escape` select chapter_order from texts where id=${textId}`,
      );

      if (errorGetChapterOrder) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      let chapterOrder = [];
      if (dataGetChapterOrder[0].chapter_order != null) {
        chapterOrder = JSON.parse(dataGetChapterOrder[0].chapter_order);
      }

      const deletedChapterOreder = chapterOrder.filter((id) => {
        return id != req.query.chapter_id;
      });

      const { data: dataUpdateChapterOrder, error: errorUpdateChapterOrder } =
        await dbQuery(escape` update texts set chapter_order=${JSON.stringify(deletedChapterOreder)}
      where id =${textId}`);

      error = errorDelete;
      data = dataDelete;
      break;

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end('method not allowed');
  }

  if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

  if (data.affectedRows == 0)
    return res.status(Consts.HTTP_BAD_REQUEST).end('chapter does not exist or you are not author');

  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
