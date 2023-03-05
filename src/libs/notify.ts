import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { omitstr } from 'utils/omitstr';

const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { SignatureV4 } = require('@aws-sdk/signature-v4');

async function notify(textId, message, url) {
  const { data } = await dbQuery(escape`
        select author_id, title from texts where id = ${textId}`);

  if (data.length > 0) {
    const authorId = data[0].author_id;
    const title = data[0].title;
    if (authorId) {
      const omitTite = omitstr(title, 10, '...');

      const id = genid(8);

      const msg = `<p><b>${omitTite}</b>${message}</p>`;

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
  sendMail();
}

export async function sendMail(addr, message) {
  const signer = new SignatureV4({
    region: process.env.AWS_LAMBDA_REGION,
    service: 'lambda',
    sha256: Sha256,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_FUNCTION_IAM_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_LAMBDA_FUNCTION_IAM_SECRET_ACCESS_KEY,
    },
  });

  const req = await signer.sign(
    new HttpRequest({
      method: 'POST',
      protocol: 'https:',
      path: '/',
      hostname: process.env.AWS_LAMBDA_FUNCTION_URL,
      headers: {
        host: process.env.AWS_LAMBDA_FUNCTION_URL,
      },
      body: JSON.stringify({ hello: 'world' }),
    }),
  );

  console.log(req);

  const res = await fetch(`${req.protocol}${req.hostname}${req.path}`, {
    method: req.method,
    body: req.body,
    headers: req.headers,
  });

  console.log(await res);
}
