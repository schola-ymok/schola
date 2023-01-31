import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

export async function getAuthorIdFromTextId(textId) {
  const { data, error } = await dbQuery(escape`
        select author_id from texts where id = ${textId}`);

  console.log(data);
  if (data.length > 0) {
    return { authorId: data[0].author_id };
  } else {
    return { error: '' };
  }
}
