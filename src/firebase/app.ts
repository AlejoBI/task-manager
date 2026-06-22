import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { firebaseConfig, validateFirebaseConfig } from "./credentials";

validateFirebaseConfig();

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const getDb = (app: FirebaseApp) => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("already been started")) {
      return getFirestore(app);
    }
    throw err;
  }
};

const db = getDb(app);

export { app, auth, db };
