import React from "react";
import "./App.css";
import { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
// import SignIn from "./components/SignIn";
// import SignOut from "./components/SingOut.jsx";

firebase.initializeApp({
  apiKey: "AIzaSyBcyMhQE-Zr6lcaueSj3fZurQNF2J0um_0",
  authDomain: "chatty-8710b.firebaseapp.com",
  projectId: "chatty-8710b",
  storageBucket: "chatty-8710b.appspot.com",
  messagingSenderId: "626988455670",
  appId: "1:626988455670:web:04dfd76329fc0b97f9bed7",
  measurementId: "G-MNGHS480VQ",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  console.log(user);
  console.log(auth.currentUser);

  return (
    <div className="App">
      <header>
        <h1>Chatty🔥</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <h2 style={{ color: "white" }}>Start Chating NOW! 🔥</h2>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}
function ChatRoom() {
  const dummy = React.useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => {
            console.log(msg);
            return <ChatMessage key={msg.id} message={msg} />;
          })}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
          alt="profile"
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
