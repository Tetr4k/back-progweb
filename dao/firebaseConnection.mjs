import { firebaseConfig } from '../config.mjs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore/lite';
  
const getDB = () => {
	const firebaseApp = initializeApp(firebaseConfig);
	return getFirestore(firebaseApp);
};

const getCollection = (firebaseCollection) => {
	const db = getDB();
	return collection(db, firebaseCollection)
}
const getChats = () => getCollection("chats");
const getUsers = () => getCollection("users");
const getMessages = () => getCollection("messages");

export { getChats, getMessages, getUsers };