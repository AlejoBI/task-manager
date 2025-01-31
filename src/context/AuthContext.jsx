/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

import appFirebase from "../firebase/credentials.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-all react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const errorsList = {
    "auth/email-already-in-use": "Email already in use",
    "permission-denied": "Insufficient permissions",
    "auth/weak-password": "Weak password",
    "auth/invalid-email": "Invalid email",
    "auth/invalid-credential": "Invalid credential",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
    "auth/popup-closed-by-user": "Popup closed by user",
  };

  const signup = async ({ username, email, password, role }) => {
    setLoading(true);
    setErrors(null);
    try {
      if (password.length < 6) {
        setErrors("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      await setDoc(docRef, {
        username,
        email,
        role,
      });

      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (errorsList[error.code]) {
        setErrors(errorsList[error.code]);
      } else {
        setErrors(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signin = async ({ email, password }) => {
    setLoading(true);
    setErrors(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) {
        setErrors("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (errorsList[error.code]) {
        setErrors(errorsList[error.code]);
      } else {
        setErrors(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setErrors(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      const userDoc = await getDoc(docRef);

      let userData;
      if (!userDoc.exists()) {
        userData = {
          username: userCredential.user.displayName,
          email: userCredential.user.email,
          role: "customer",
        };
        await setDoc(docRef, userData);
      } else {
        userData = userDoc.data();
      }

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
      return userCredential.user;
    } catch (error) {
      if (errorsList[error.code]) {
        setErrors(errorsList[error.code]);
      } else {
        setErrors(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setErrors(null);
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    setErrors(null);
    setLoading(true);
    try {
      const q = query(collection(fireStore, "users"));
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return users;
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setErrors(null);
      if (currentUser) {
        try {
          const docRef = doc(fireStore, "users", currentUser.uid);
          const userDoc = await getDoc(docRef);
          const userData = userDoc.exists() ? userDoc.data() : null;

          if (userData) {
            setUser({ id: currentUser.uid, ...userData });
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signInWithGoogle,
        logout,
        getAllUsers,
        user,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
