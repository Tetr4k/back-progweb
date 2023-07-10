import express from "express";
import { query, getDoc, addDoc } from 'firebase/firestore/lite';

const router = express.Router();

router.post("/messages", async (req, res) => {
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

export default router