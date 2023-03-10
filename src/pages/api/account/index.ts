import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import { verifyFirebaseToken } from 'libs/firebase/verifyFirebaseToken';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { isEmptyString } from 'utils/isEmptyString';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const verify = await verifyFirebaseToken(req);
  if (!verify) return res.status(Consts.HTTP_FORBIDDEN).end();

  switch (req.method) {
    case 'GET':
      const selectPhrase =
        req.query.prl !== undefined
          ? 'id, display_name, banned, account_name, photo_id, email, email_verified'
          : '*';

      const { data, error } = await dbQuery(`
      select ${selectPhrase} 
      from
        users
      where
        firebase_id='${req.headers.firebase_id}'`);

      if (error) res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end(`error`);

      if (data) {
        if (data.length > 0) {
          return res.status(Consts.HTTP_OK).json(data[0]);
        } else {
          return res.status(Consts.HTTP_BAD_REQUEST).end('user does not exist');
        }
      }

      break;

    case 'POST':
      const accountName = req.body.account_name;
      const displayName = req.body.display_name;
      const email = req.body.email;
      const emailVerified = req.body.email_verified;
      if (isEmptyString(accountName) || isEmptyString(displayName))
        return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

      // check account is not exists
      const { data: exists, error: errorExists } = await dbQuery(escape`
        select id from users
          where firebase_id = ${req.headers.firebase_id}`);

      if (errorExists) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end();
      if (exists.length > 0) {
        return res.status(Consts.HTTP_OK).json({
          status: 'exists',
          user_id: data[0].id,
        });
      }

      // check account name is not used
      const { data: used, error: errorUsed } = await dbQuery(escape`
        select exists (select 1 from users
          where account_name = ${accountName}) as cnt`);

      if (errorUsed) return res.status(Conts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      if (used[0].cnt != 0) return res.status(Consts.HTTP_OK).json({ status: 'duplicate' });

      // add new account
      const userId = genid();
      const { error: errorAdd } = await dbQuery(escape`
      insert into users (
        id,
        firebase_id,
        account_name,
        display_name,
        email,
        email_verified
      ) values (
        ${userId},
        ${req.headers.firebase_id},
        ${accountName},
        ${displayName},
        ${req.body.email},
        ${req.body.email_verified}
      )`);

      if (errorAdd) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      return res.status(Consts.HTTP_OK).json({
        status: 'ok',
        user_id: userId,
      });

    case 'PUT':
      const mail = req.query.mail == 1 ? true : false;
      let query;

      if (req.query.photo_id) {
        const { error } = await dbQuery(escape`
        update users
        set photo_id = ${req.query.photo_id}
        where firebase_id = ${req.headers.firebase_id}
        `);
        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.updateemail) {
        //?????????????????????????????????????????????????????????

        const email = req.body.email;
        const emailVerified = req.body.emailVerified ? 1 : 0;

        console.log('---');
        query = escape`update users set email =${email},email_verified=${emailVerified} where firebase_id=${req.headers.firebase_id}`;

        const { error } = await dbQuery(query);
        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.emailverified) {
        //????????????????????????
        query = escape`update users set email_verified = true where firebase_id=${req.headers.firebase_id}`;

        const { error } = await dbQuery(query);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.notifypurchase) {
        // change notify on purchase flag
        const notifyOnPurchase = req.query.notifypurchase == 1 ? true : false;

        query = mail
          ? escape`update users set notify_on_purchase_mail = ${notifyOnPurchase}`
          : escape`update users set notify_on_purchase_web = ${notifyOnPurchase} where firebase_id=${req.headers.firebase_id}`;

        const { error } = await dbQuery(query);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.notifyreview) {
        // change notify on review flag
        const notifyOnReview = req.query.notifyreview == 1 ? true : false;

        query = mail
          ? escape`update users set notify_on_review_mail = ${notifyOnReview}`
          : escape`update users set notify_on_review_web = ${notifyOnReview} where firebase_id=${req.headers.firebase_id}`;

        const { error } = await dbQuery(query);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.notifyupdate) {
        // change notify on update flag
        const notifyOnUpdate = req.query.notifyupdate == 1 ? true : false;

        query = mail
          ? escape`update users set notify_on_update_mail = ${notifyOnUpdate}`
          : escape`update users set notify_on_update_web = ${notifyOnUpdate} where firebase_id=${req.headers.firebase_id}`;

        const { error } = await dbQuery(query);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else if (req.query.changeaccount != undefined) {
        const accountName = req.body.account_name;

        if (isEmptyString(accountName))
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        // check account name is not used
        const { data: used, error: errorUsed } = await dbQuery(escape`
          select exists (select 1 from users
            where account_name = ${accountName}) as cnt`);

        if (errorUsed) return res.status(Conts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        if (used[0].cnt != 0) return res.status(Consts.HTTP_OK).json({ status: 'duplicate' });

        const { error } = await dbQuery(escape`
        update users
        set account_name = ${accountName} 
        where firebase_id = ${req.headers.firebase_id}
        `);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      } else {
        // update profile
        const displayName = req.body.display_name;
        const profileMessage = req.body.profile_message;
        const majors = req.body.majors;
        const twitter = req.body.twitter;
        const web = req.body.web;
        const facebook = req.body.facebook;

        if (isEmptyString(displayName))
          return res.status(Consts.HTTP_BAD_REQUEST).end('bad parameter');

        const { error } = await dbQuery(escape`
        update users
        set
        display_name = ${displayName}, 
        profile_message = ${profileMessage}, 
        majors = ${majors} ,
        twitter = ${twitter},
        web = ${web},
        facebook = ${facebook} 
        where firebase_id = ${req.headers.firebase_id}
        `);

        if (error) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        //console.log(req.headers.firebase_id);

        return res.status(Consts.HTTP_OK).json({ status: 'ok' });
      }

    default:
      return res.status(Consts.HTTP_METHOD_NOT_ALLOWED).end();
  }
}
