import { auth } from "../config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile,
} from "firebase/auth";
import { putUserUpdate, getUserDetail } from "@/services/user";
import { formatPhoneNumber } from "@/utils/helper";

export async function googleSignIn() {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleProvider)
    .then((userCredential) => {
      updateProfile(userCredential.user, {
        displayName: userCredential?.user?.displayName,
      });
      getUserDetail(userCredential.user.uid).catch((error) => {
        putUserUpdate(
          {
            role: "admin",
            phone_number: formatPhoneNumber(
              userCredential?.user?.phoneNumber ?? ""
            ),
          },
          userCredential.user.uid
        );
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export async function facebookSignIn() {
  try {
    const facebookProvider = new FacebookAuthProvider();
    signInWithPopup(auth, facebookProvider);
  } catch (error) {
    // console.log({ error });
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
