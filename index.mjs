import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore/lite';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbNpj1BgBMKYVBuiagXmdrH899KMrg0UM",
  authDomain: "progweb-zapgpt.firebaseapp.com",
  databaseURL: "https://progweb-zapgpt-default-rtdb.firebaseio.com",
  projectId: "progweb-zapgpt",
  storageBucket: "progweb-zapgpt.appspot.com",
  messagingSenderId: "853112836486",
  appId: "1:853112836486:web:235e66db12466a17a3dc07",
  measurementId: "G-MZDTV8LQ5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

try {
	const docRef = await addDoc(collection(db, "users"), {
	  username: "Ada",
	  nickname: "Lovelace",
	  password: "1815",
	  email: "aaaa",
	});
	console.log("Document written with ID: ", docRef.id);
} catch (e) {
	console.error("Error adding document: ", e);
}

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});