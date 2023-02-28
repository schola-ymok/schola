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

  switch (req.method) {
    case 'GET': // get text
      const selectValues =
        req.query.brf !== undefined
          ? escape`texts.id, title, state, users.photo_id as author_photo_id, texts.photo_id as photo_id, abstract, explanation, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, updated_at, is_public, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5`
          : escape`texts.id, title, state, users.photo_id as author_photo_id,texts.photo_id as photo_id, abstract, explanation, author_id, notice, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, created_at, updated_at, number_of_updated, category1, category2, chapter_order, learning_contents, learning_requirements, is_public, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5`;

      const selectQuery = escape`select `.append(selectValues).append(escape`
        from texts
        inner join users on texts.author_id = users.id
        where texts.id=${req.query.text_id}`);

      const { data: dataGet, error: errorGet } = await dbQuery(selectQuery);

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataGet.length > 0) {
        if (!dataGet[0].is_public) {
          if (!verify || (verify && dataGet[0].author_id != req.headers.user_id)) {
            return res.status(Consts.HTTP_BAD_REQUEST).end('text is not public');
          }
        }
        return res.status(Consts.HTTP_OK).json(dataGet[0]);
      } else {
        return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist');
      }

    case 'PUT': // update text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      if (req.query.reqreview !== undefined) {
        const { data: dataReqReview, error: errorReqReview } = await dbQuery(escape`
        update texts
        set
        state = ${Consts.TEXTSTATE.UnderReview},
        is_public = true
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
        and
        (
        state = ${Consts.TEXTSTATE.Draft}
        or
        state = ${Consts.TEXTSTATE.DraftBanned}
        or
        state = ${Consts.TEXTSTATE.DraftRejected}
        )
        `);

        data = dataReqReview;
        error = errorReqReview;
      } else if (req.query.rls) {
        const isPublic = req.body.is_public;
        const { data: dataRelease, error: errorRelease } = await dbQuery(escape`
        update texts
        set
        is_public = ${isPublic}
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
        `);

        data = dataRelease;
        error = errorRelease;
      } else if (req.query.chapter_order !== undefined) {
        const { data: dataChapterOrder, error: errorChapterOrder } = await dbQuery(escape`
        update texts
        set
        chapter_order = ${req.body.chapter_order}
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
        `);

        data = dataChapterOrder;
        error = errorChapterOrder;
      } else if (req.query.photo_id) {
        const { data: dataPhotoUpdate, error: errorPhotoUpdate } = await dbQuery(escape`
        update texts
        set
        photo_id = ${req.query.photo_id}
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
        `);

        data = dataPhotoUpdate;
        error = errorPhotoUpdate;
      } else {
        const title = req.body.title;
        const abstract = req.body.abstract;
        const explanation = req.body.explanation;
        const price = req.body.price;
        const category1 = req.body.category1;
        const category2 = req.body.category2;
        const learningContents = req.body.learning_contents;
        const learningRequirements = req.body.learning_requirements;

        if (isEmptyString(title) || isEmptyString(abstract) || !Number.isInteger(price))
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        const { data: dataState, error: errorState } = await dbQuery(escape`
          select state from texts where id=${req.query.text_id}
          `);

        if (errorState) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        let state;
        if (dataState.length > 0) {
          state = dataState[0].state;
        } else {
          return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist');
        }

        if (state == Consts.TEXTSTATE.Created) state = Consts.TEXTSTATE.Draft;

        const { data: dataUpdate, error: errorUpdate } = await dbQuery(escape`
          update texts
          set
          title = ${title},
          abstract = ${abstract},
          explanation = ${explanation},
          price = ${price},
          category1 = ${category1},
          category2 = ${category2},
          learning_contents = ${learningContents},
          learning_requirements = ${learningRequirements},
          state = ${state},
          number_of_updated = number_of_updated + 1
          where
          id = ${req.query.text_id}
          and
          author_id = ${req.headers.user_id}
          `);

        data = dataUpdate;
        error = errorUpdate;
      }

      break;

    case 'DELETE': // delete text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end(`not authorized`);

      const { data: __dataDelete, error: __errorDelete } = await dbQuery(escape`
      delete from reviews
        where
        text_id = ${req.query.text_id}
      `);

      const { data: _dataDelete, error: _errorDelete } = await dbQuery(escape`
      delete from chapters
        where
        text_id = ${req.query.text_id}
      `);

      const { data: dataDelete, error: errorDelete } = await dbQuery(escape`
      delete from texts
        where
        id = ${req.query.text_id}
        and
        author_id = ${req.headers.user_id}
      `);

      data = dataDelete;
      error = errorDelete;
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
