import * as admin from 'firebase-admin';

// Lazy singleton — initialize only once, guard against hot-reload double-init
function getFirebaseApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('[PushService] FIREBASE_SERVICE_ACCOUNT_JSON env var is not set');
  }

  let serviceAccount: admin.ServiceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
  } catch {
    throw new Error('[PushService] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Send a single FCM push notification to a device token.
 * Throws if FCM rejects the message (invalid token, unregistered, etc.)
 */
export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<string> {
  const app = getFirebaseApp();
  const messaging = admin.messaging(app);

  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    ...(data && { data }),
  };

  const messageId = await messaging.send(message);
  return messageId;
}
