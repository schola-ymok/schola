import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

export async function notify(userId, message, url) {
  const id = genid(8);

  await dbQuery(escape`
        insert into notices ( id, readed, message, url, user_id )
        values
        (${id}, false, ${message}, ${url}, ${userId})`);
}
