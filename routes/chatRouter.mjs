import express from "express";
import { query, addDoc, getDocs, where } from 'firebase/firestore/lite';
import { getMessages, getChats } from "../dao/firebaseConnection.mjs";

const router = express.Router();

//Todos os chats
router.get("/chats", async (req, res) => {
	console.log("GET /chats");

	try{
		const firebaseChats = await getDocs(getChats());
	
		let chats = [];
	
		firebaseChats.forEach((elem) => {
			const { title } = elem.data();
			chats.push({
				chatID: elem.id,
				title: title
			})
		});
			
		console.log("Realizado com Sucesso");
		res.status(200).send(chats);
	}
	catch (error){
		console.log(error);
		res.status(500).send(error);
	}
});

//chats com mensagens do usuario
router.get("/chats/:userID", async (req, res) => {
	const userID = req.params.userID;

	console.log("GET /chats/"+userID);

	try{
		const messagesQuery = query(getMessages(), where("owner", "==", userID))
		const firebaseMessages = await getDocs(messagesQuery);

		let chats = [];
		firebaseMessages.forEach((elem) => chats.push(elem.data().chat))
		chats.filter((elem, index) => chats.indexOf(elem) == index);
		
		console.log("Realizado com Sucesso");
		res.status(200).send(chats);
	}
	catch (error){
		console.log(error);
		res.status(500).send(error);
	}
});

router.get("/messages/", async (req, res) => {
	console.log("GET /messages/");

	try{
		console.log("Realizado com Sucesso");
		res.status(200).send([]);
	}
	catch (error) {
		console.log(error.message);
		res.status(500).send(error.message);
	}
});

router.get("/messages/:chatID", async (req, res) => {
	const chatID = req.params.chatID;

	console.log("GET /messages/"+chatID);
  
	try{
		/*if(Math.random()%20){
			const docRef = await addDoc(getMessages(), {
				chat: chatID,
				owner: undefined,
				content: randomMessage(),
				time: Date.now()
			});
		}*/
		let messages = [];

		const messagesQuery = query(getMessages(), where("chat", "==", chatID));
		const firebaseMessages = await getDocs(messagesQuery);

		firebaseMessages.forEach(elem => {
			const {time, owner, content} = elem.data();
			messages.push({
				time: time,
				owner: owner,
				content: content
			})
		})
		
		console.log("Realizado com Sucesso");
		res.status(200).send(messages);
	}
	catch (error) {
		console.log(error.message);
		res.status(500).send(error.message);
	}
});

//Registra mensagem
router.post("/messages", async (req, res) => {
	const { chatID, userID, content, time } = req.body;
	
	console.log("POST /messages")

	try{
		let newChatID;
	
		if (!chatID) {
			const docRef = await addDoc(getChats(), {
				title: content
			});
			newChatID = docRef.id;
		}
		newChatID = chatID ? chatID : newChatID

		const msgDocRef = await addDoc(getMessages(), {
				chat: newChatID,
				content: content,
				time: time,
				owner: userID
		});
	
		const messagesRef = query(getMessages(), where("chatID", "==", newChatID))
		const messagesDoc = await getDocs(messagesRef);
	
		let messages = [];
	
		messagesDoc.forEach(elem => {
			const {time, owner, content} = elem.data();
			messages.push({
				time: time,
				owner: owner,
				content: content
			})
		})
	  
		console.log("Realizado com Sucesso");
	  	res.status(200).send(messages);
	}
	catch (error) {
		console.log(error.message);
		res.status(500).send(error.message);
	}
});

export default router