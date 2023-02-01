import { text } from 'stream/consumers';

import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

async function notify(textId, message, url) {
  const { data } = await dbQuery(escape`
        select author_id, title from texts where id = ${textId}`);

  if (data.length > 0) {
    const authorId = data[0].author_id;
    const title = data[0].title;
    if (authorId) {
      const sliceTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;

      const id = genid(8);

      const msg = `<p><b>${sliceTitle}</b>${message}</p>`;

      await dbQuery(escape`
            insert into notices ( id, readed, message, url, user_id )
            values
            (${id}, false, ${msg}, ${url}, ${authorId})`);

      const countQuery = escape`select count(*) as cnt from notices where user_id = ${authorId}`;
      const { data: dataCount, error: errorCount } = await dbQuery(countQuery);
      if (!errorCount) {
        const total = dataCount[0].cnt;
        const deleteNum = total - 300;
        if (deleteNum > 0) {
          dbQuery(escape`delete from notices order by created_at limit ${deleteNum}`);
        }
      }
    }
  }
}

export async function notifyRejected(textId) {
  notify(textId, Consts.NOTICE_MESSAGE.rejected, `/texts/${textId}/edit?ntc`);
}

export async function notifyApproved(textId) {
  notify(textId, Consts.NOTICE_MESSAGE.approved, `/texts/${textId}`);
}

export async function notifyBanned(textId) {
  notify(textId, Consts.NOTICE_MESSAGE.banned, `/texts/${textId}/edit?ntc`);
}

export async function notifyPurchase(textId) {
  notify(textId, Consts.NOTICE_MESSAGE.purchased, `/texts/${textId}`);
}

export async function notifyReviewed(textId, reviewId) {
  notify(textId, Consts.NOTICE_MESSAGE.reviewed, `/texts/${textId}/reviews/${reviewId}`);
}
