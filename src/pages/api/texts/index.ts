import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      const page =
        Number.isInteger(Number(req.query.page)) && req.query.page > 0 ? req.query.page - 1 : 0;
      let offset = page * Consts.SELECT_LIMIT;
      let limit = Consts.SELECT_LIMIT;

      if (req.query.home == 1) {
        offset = 0;
        limit =
          Number.isInteger(Number(req.query.limit)) && req.query.limit > 0
            ? Number(req.query.limit)
            : 5;
      }

      let wherePhrase = escape` where is_released = true`;
      let joinPhrase = escape` inner join users on texts.author_id = users.id`;
      let orderPhrase = escape` order by texts.updated_at desc`;

      const categoryKeys = Object.keys(Consts.CATEGORY);

      if (categoryKeys.includes(req.query.category1)) {
        wherePhrase = wherePhrase.append(escape` and category1=${req.query.category1}`);

        const filterCat2 = Consts.CATEGORY[req.query.category1].items.filter(
          (v) => v.key === req.query.category2,
        );
        if (filterCat2.length > 0) {
          wherePhrase = wherePhrase.append(escape` and category2=${req.query.category2}`);
        }
      }

      if (Number.isInteger(Number(req.query.rate)) && req.query.rate > 0 && req.query.rate < 6) {
        wherePhrase = wherePhrase.append(escape` and rate > ${req.query.rate}`);
      }

      if (req.query.pf_1 || req.query.pf_2 || req.query.pf_3 || req.query.pf_4 || req.query.pf_5) {
        wherePhrase = wherePhrase.append(` and (`);

        let opPhrase = '';
        if (req.query.pf_1) {
          wherePhrase = wherePhrase.append(` (price >= 100 and price <= 200)`);
          opPhrase = 'or';
        }
        if (req.query.pf_2) {
          wherePhrase = wherePhrase.append(` ${opPhrase} (price >= 200 and price <= 300)`);
          opPhrase = 'or';
        }
        if (req.query.pf_3) {
          wherePhrase = wherePhrase.append(` ${opPhrase} (price >= 300 and price <= 400)`);
          opPhrase = 'or';
        }
        if (req.query.pf_4) {
          wherePhrase = wherePhrase.append(` ${opPhrase} (price >= 400 and price <= 500)`);
          opPhrase = 'or';
        }
        if (req.query.pf_5) {
          wherePhrase = wherePhrase.append(` ${opPhrase} (price >= 500 and price <= 1000)`);
        }

        wherePhrase = wherePhrase.append(escape` )`);
      }

      if (!isEmptyString(req.query.keyword)) {
        wherePhrase = wherePhrase.append(escape` and 
        ( match(texts.title,abstract,learning_contents,learning_requirements) against(${req.query.keyword}) or
          match(users.display_name,profile_message,majors) against(${req.query.keyword}) or
          match(chapters.title,content) against(${req.query.keyword}) )
        `);
        joinPhrase = joinPhrase.append(escape`
          left outer join chapters on texts.id = chapters.text_id
        `);
      }

      if (req.query.type == 'ranking') {
        orderPhrase = ' order by texts.number_of_sales desc';
      } else if (req.query.type == 'reviewed') {
        orderPhrase = ' order by texts.number_of_reviews desc';
      } else {
        if (req.query.sort == 'sales') {
          orderPhrase = ' order by texts.number_of_sales desc';
        } else if (req.query.sort == 'new') {
          orderPhrase = ' order by texts.updated_at desc';
        } else if (req.query.sort == 'old') {
          orderPhrase = ' order by texts.updated_at';
        } else if (req.query.sort == 'rate') {
          orderPhrase = ' order by texts.rate desc';
        } else if (req.query.sort == 'price_high') {
          orderPhrase = ' order by texts.price desc';
        } else if (req.query.sort == 'price_low') {
          orderPhrase = ' order by texts.price';
        }
      }

      const getQuery = escape`
        select distinct
        texts.id, texts.title, texts.photo_id as photo_id, users.photo_id as author_photo_id, substring(abstract,128) as abstract, author_id, users.display_name as author_display_name, price, number_of_sales, number_of_reviews, texts.updated_at, is_released, is_best_seller, rate, rate_ratio_1, rate_ratio_2, rate_ratio_3, rate_ratio_4, rate_ratio_5
        from texts`
        .append(joinPhrase)
        .append(wherePhrase)
        .append(orderPhrase)
        .append(escape` limit ${limit} offset ${offset}`);

      const countQuery = escape`select count(distinct texts.id) as cnt from texts `
        .append(joinPhrase)
        .append(wherePhrase);

      const { data: dataCount, error: errorCount } = await dbQuery(countQuery);
      const { data: dataGet, error: errorGet } = await dbQuery(getQuery);

      if (errorGet || errorCount) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(200).json({
        total: dataCount[0].cnt,
        page: page,
        texts: dataGet,
      });
    case 'POST': // add new text
      const verify = await verifyFirebaseToken(req);
      if (!verify) return res.status(Consts.HTTP_FORBIDDEN).end();

      const title = req.body.title;

      if (isEmptyString(title)) return res.status(Consts.HTTP_BAD_REQUEST).json('bad parameter');

      const textId = genid();
      const { error: errorInsert } = await dbQuery(escape`
      insert into texts (
        id,
        title,
        author_id,
        is_released,
        number_of_updated,
        number_of_sales,
        number_of_reviews,
        is_best_seller
      ) values (
        ${textId},
        ${title},
        ${req.headers.user_id},
        false,
        0,
        0,
        0,
        false
      )`);

      if (errorInsert) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
        text_id: textId,
      });

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end();
  }
}
