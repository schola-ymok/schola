import { text } from 'stream/consumers';

import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

async function notify(userId, message, url) {
  const id = genid(8);

  await dbQuery(escape`
        insert into notices ( id, readed, message, url, user_id )
        values
        (${id}, false, ${message}, ${url}, ${userId})`);
}

async function notifyTextStateChaged(textId, msg, url) {
  const { data } = await dbQuery(escape`
        select author_id, title from texts where id = ${textId}`);

  if (data.length > 0) {
    const authorId = data[0].author_id;
    const title = data[0].title;
    if (authorId) {
      const sliceTitle = title.length > 10 ? title.slice(0, 10) + '...' : title;
      notify(authorId, `<span><b>${sliceTitle}</b>${msg}</span>`, url);
    }
  }
}

export async function notifyRejected(textId) {
  notifyTextStateChaged(textId, Consts.NOTICE_MESSAGE.rejected, `/texts/${textId}/edit?ntc`);
}

export async function notifyApproved(textId) {
  notifyTextStateChaged(textId, Consts.NOTICE_MESSAGE.approved, `/texts/${textId}`);
}

export async function notifyBanned(textId) {
  notifyTextStateChaged(textId, Consts.NOTICE_MESSAGE.banned, `/texts/${textId}/edit?ntc`);
}
