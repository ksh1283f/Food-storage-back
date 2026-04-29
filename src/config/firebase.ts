import * as admin from 'firebase-admin';
import * as path from 'path';

let initError: Error | null = null;

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } else {
    initError = new Error(
      'Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.'
    );
    console.error('[Firebase]', initError.message);
  }
}

export { initError };
export default admin;
