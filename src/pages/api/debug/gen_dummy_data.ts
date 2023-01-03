import fs from 'fs';
import path from 'path';

import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const USER_NUM = 50;
  const REP_AUTHOR_ID = 'ZUjBKTRU';

  const wikiPath = path.resolve('./src/pages/api/debug/', 'wiki.json');
  const wikiJson = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

  // delete
  for (var i = 0; i < wikiJson.length; i++) {
    const textId = ('00000000' + wikiJson[i].pid).slice(-8);
    await dbQuery(escape`delete from purchases where text_id=${textId}`);
    await dbQuery(escape`delete from reviews where text_id=${textId}`);
    await dbQuery(escape`delete from texts where id=${textId}`);
  }

  for (var i = 0; i < USER_NUM; i++) {
    userId = 'uid-' + ('0000' + i).slice(-4);
    await dbQuery(escape`delete from users where id = ${userId}`);
  }

  // gen dummy users
  var accountName, displayName, userId, firebaseId;
  for (var i = 0; i < USER_NUM; i++) {
    accountName = 'account-' + i;
    displayName = 'ダミーユーザ ' + i;
    userId = 'uid-' + ('0000' + i).slice(-4);
    firebaseId = genid() + genid() + genid() + genid() + genid() + genid();

    const { error: errorAdd } = await dbQuery(escape`
      insert into users (
        id,
        firebase_id,
        account_name,
        display_name
      ) values (
        ${userId},
        ${firebaseId},
        ${accountName},
        ${displayName}
      )`);

    if (errorAdd) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
  }

  // gen dummy texts, review
  for (var k = 0; k < wikiJson.length; k++) {
    const textId = ('00000000' + wikiJson[k].pid).slice(-8);

    const AUTHOR_ID =
      Math.random() > 0.4
        ? REP_AUTHOR_ID
        : 'uid-' + ('0000' + Math.floor(Math.random() * USER_NUM)).slice(-4);

    const cat1arr = Object.keys(Consts.CATEGORY);
    let cat1 = cat1arr[Math.floor(Math.random() * cat1arr.length)];

    const cat2arr = Consts.CATEGORY[cat1].items;

    let cat2 = cat2arr[Math.floor(Math.random() * cat2arr.length)];

    const qcat1 = Math.random() > 0.1 ? cat1 : null;
    const qcat2 = qcat1 !== null && Math.random() > 0.4 ? cat2.key : null;

    const price = Math.floor(Math.random() * 10 + 1) * 100;

    const { error: textAdd } = await dbQuery(escape`
      insert into texts (
        id,
        title,
        author_id,
        abstract,
        is_released,
        number_of_updated,
        number_of_sales,
        number_of_reviews,
        is_best_seller,
        category1,
        category2,
        price
      ) values (
        ${textId},
        ${wikiJson[k].title},
        ${AUTHOR_ID},
        ${wikiJson[k].abstract},
        true,
        0,
        0,
        0,
        false,
        ${qcat1},
        ${qcat2},
        ${price}
      )`);

    if (textAdd) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

    let numOfReviews = 0;
    let numOfSales = 0;
    let avgRate = 0;

    for (var i = 0; i < USER_NUM; i++) {
      if (Math.random() > 0.7) {
        const uid = 'uid-' + ('0000' + i).slice(-4);
        const { error: error3 } = await dbQuery(escape`
            insert into purchases (
                user_id,
                text_id
              )values(
                ${uid},
                ${textId}
            )`);

        numOfSales++;
        if (error3) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        if (Math.random() > 0.5) {
          const rate = Math.floor(Math.random() * 5) + 1;
          const title = 'review_title_' + Math.floor(Math.random() * 500);
          const comment = 'review_comment_' + Math.floor(Math.random() * 500);
          const rid = genid();
          avgRate += rate;
          numOfReviews++;

          const { error: error2 } = await dbQuery(escape`
            insert into reviews (
                id,
                text_id,
                user_id,
                title,
                comment,
                rate
              )values(
                ${rid},
                ${textId},
                ${uid},
                ${title},
                ${comment},
                ${rate}
            )`);
          if (error2) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        }
      }
    }
    if (numOfReviews != 0) {
      avgRate = Math.floor(avgRate / numOfReviews);
    }
    const { error: error4 } = await dbQuery(escape`
          update texts
          set
          number_of_reviews = ${numOfReviews},
          number_of_sales = ${numOfSales},
          rate = ${avgRate}
          where id = ${textId}`);

    if (error4) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
  }

  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
