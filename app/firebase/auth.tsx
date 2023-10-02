import firebase_app from "./config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const auth = getAuth(firebase_app);

export async function SignUp(email: string, password: string) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    if (result) {
      console.log("signup succeed!!!");
    }
  } catch (e) {
    // @ts-ignore
    const errorCode = e.code;
    // @ts-ignore
    const errorMessage = e.message;
    error = e;
  }

  return { result, error };
}

import { UserCredential } from "firebase/auth";

export async function SignIn(
  email: string,
  password: string,
): Promise<{ result: UserCredential | null; error: any }> {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    const errorCode = e.code;
    const errorMessage = e.message;
    error = e;
  }

  console.log("result", result);

  return { result, error };
}

export async function SignOut() {
  let result = null,
    error = null;
  try {
    result = await auth.signOut();
    console.log("Sign-out successful.");
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export const GoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");
  provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log("user", user.toJSON);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", errorCode, errorMessage);
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

// export const resetPassword = (auth: Auth, email: string) => {
//     sendPasswordResetEmail(auth, email)
//         .then(() => {
//             // Password reset email sent!
//             // ..
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // ..
//         });
// };
