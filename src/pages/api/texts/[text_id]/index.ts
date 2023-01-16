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
          ? escape`texts.id, title, users.photo_id as author_photo_id, texts.photo_id as photo_id, abstract, explanation, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, updated_at, is_released, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5`
          : escape`texts.id, title, users.photo_id as author_photo_id,texts.photo_id as photo_id, abstract, explanation, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, created_at, updated_at, number_of_updated, category1, category2, chapter_order, learning_contents, learning_requirements, is_released, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5`;

      const selectQuery = escape`select `.append(selectValues).append(escape`
        from texts
        inner join users on texts.author_id = users.id
        where texts.id=${req.query.text_id}`);

      const { data: dataGet, error: errorGet } = await dbQuery(selectQuery);

      if (errorGet) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (dataGet.length > 0) {
        if (!dataGet[0].is_released) {
          if (!verify || (verify && dataGet[0].author_id != req.headers.user_id)) {
            return res.status(Consts.HTTP_BAD_REQUEST).end('text not released');
          }
        }
        return res.status(Consts.HTTP_OK).json(dataGet[0]);
      } else {
        return res.status(Consts.HTTP_BAD_REQUEST).end('text does not exist');
      }

    case 'PUT': // update text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end('not authorized');

      if (req.query.release) {
        const release = req.query.release == 1 ? true : false;
        const { data: dataRelease, error: errorRelease } = await dbQuery(escape`
        update texts
        set
        is_released = ${release}
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

        console.log(req.body.chapter_order);

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
        if (req.query.rls) {
          const isReleased = req.body.is_released == true ? true : false;

          const { data: dataUpdate, error: errorUpdate } = await dbQuery(escape`
          update texts
          set
          is_released = ${isReleased}
          where
          id = ${req.query.text_id}
          and
          author_id = ${req.headers.user_id}
          `);

          data = dataUpdate;
          error = errorUpdate;
        } else {
          const title = req.body.title;
          const abstract = req.body.abstract;
          const explanation = req.body.explanation;
          const price = req.body.price;
          const category1 = req.body.category1;
          const category2 = req.body.category2;
          const chapterOrder = req.body.chapter_order;
          const learningContents = req.body.learning_contents;
          const learningRequirements = req.body.learning_requirements;

          if (isEmptyString(title) || isEmptyString(abstract) || !Number.isInteger(price))
            return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

          const { data: dataUpdate, error: errorUpdate } = await dbQuery(escape`
          update texts
          set
          title = ${title},
          abstract = ${abstract},
          explanation = ${explanation},
          price = ${price},
          category1 = ${category1},
          category2 = ${category2},
          chapter_order = ${chapterOrder},
          learning_contents = ${learningContents},
          learning_requirements = ${learningRequirements}
          where
          id = ${req.query.text_id}
          and
          author_id = ${req.headers.user_id}
        `);

          data = dataUpdate;
          error = errorUpdate;
        }
      }

      break;

    case 'DELETE': // delete text
      if (!verify) return res.status(Consts.HTTP_BAD_REQUEST).end(`not authorized`);

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
