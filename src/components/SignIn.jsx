import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "../App.css";

const SignIn = ({ auth }) => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div>
      <h2>Start chatting Now!</h2>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign In with Google
      </button>
    </div>
  );
};

export default SignIn;
