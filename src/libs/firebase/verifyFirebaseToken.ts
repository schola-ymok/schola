import * as firebaseAdmin from 'firebase-admin';

export async function verifyFirebaseToken(req) {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        private_key: process.env.FIREBASEADMIN_PRIVATEKEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASEADMIN_CLIENTMAIL,
      }),
    });
  }

  if (process.env.NEXT_PUBLIC_SKIP_AUTH) return true;

  const token = req.headers.authorization?.substr(7);
  const firebaseId = req.headers.firebase_id;

  if (!token || !firebaseId) return false;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    if (decodedToken.uid == firebaseId) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
