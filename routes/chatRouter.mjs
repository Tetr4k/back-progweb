import express from "express";
import { query, getDoc, addDoc } from 'firebase/firestore/lite';

const router = express.Router();

router.get("/chats", async (req, res) => {
	const { userID } = req.body;
  
	try{
	  const chatsRef = query(getChats(), where("userID", "==", userID))
	  const chatsDoc = await getDocs(chatsRef);
  
	  let chats = [];
  
	  chatsDoc.forEach((elem) => {
		const { titulo } = elem.data();
		chats.push({
		  chatID: elem.id,
		  titulo: titulo
		})
	  });
	  console.log("GET /chats")
	  res.status(200).send(chats);
	}
	catch (error){
	  console.log(error);
	  res.status(500).send(error);
	}
});

router.get("/chats/messages", async (req, res) => {
	const { chatID } = req.body;
  
	try{
		//Adiciona mensagem do bot aleatoriamente
		//Busca mensagens do chat e retorna
		console.log("GET /messages");
		res.status(200).send({
			chatID: newChatID,
			messages: messages
		});
	}
	catch (error) {
	  console.log(error.message);
	  res.status(500).send(error.message);
	}
});

router.post("/chats", async (req, res) => {
	const { chatID, userID, message, timeStamp } = req.body;
  
	try{
	  let newChatID;
  
	  if (!chatID) {
		const docRef = await addDoc(getChats(), {
		  userID: userID,
		  titulo: message
		});
		newChatID = docRef.id;
	  }
	  newChatID = chatID ? chatID : newChatID
  
	  const msgDocRef = await addDoc(getMessages(), {
		chatID: newChatID,
		message: message,
		timeStamp: timeStamp,
		userFlag: true
	  });
  
	  const messagesRef = query(getMessages(), where("chatID", "==", newChatID))
	  const messagesDoc = await getDocs(messagesRef);
  
	  let messages = [];
  
	  messagesDoc.forEach(doc => {
		const {timeStamp, userFlag, message} = doc.data();
		messages.push({
		  timeStamp: timeStamp,
		  userFlag: userFlag,
		  message: message
		})
	  })
	  
	  console.log("POST");
	  res.status(200).send({
		chatID: newChatID,
		messages: messages
	  });
	}
	catch (error) {
	  console.log(error.message);
	  res.status(500).send(error.message);
	}
});
  
router.put("/chats", async (req, res) => {
//Atualizar titulo do chat	
});
  
router.delete("/chat", async (req, res) => {
	const { chatid } = req.params;
  
	try {
	  const chatDoc = await getDoc(getChats(), chatid);
	  const chat = docRef.data();
	  //deletar mensagens do chat
	  //deletar chat
	}
	catch (error) {
	  console.log(error.message);
	  res.status(500).send(error.message);
	}
});

export default router