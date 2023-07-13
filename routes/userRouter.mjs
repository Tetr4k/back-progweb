import express from "express";
import User from "../models/user.mjs";
import { getUsers } from "../dao/firebaseConnection.mjs";
import { query, getDocs, addDoc, where } from 'firebase/firestore/lite';

const router = express.Router();

router.get("/login", async (req, res) => {
	const { username, password } = req.body;
  
	try{
	  	const usersRef = query(getUsers(),
	  		where("username", "==", username),
			where("password", "==", password)
		);
	  	const userDoc = await getDocs(usersRef);
	  	const userData = userDoc.docs[0];
  
	  	res.status(200).send(userData ? userData.id : false);
	}
	catch (error){
	  	console.log(error.message);
	  	res.status(401).send(error.message);
	}
});

router.post("/cadastra", async (req, res) => {
	const { username, password, firstname, lastname, email, date } = req.body;
	//const newUser = new User(firstname, lastname, email, date);
	try {
		//validar
		//username ou email ja cadastrado?
		const usrnmQuery = query(getUsers(), where("username", "==", username));
		const emailQuery = query(getUsers(), where("email", "==", email));
		const existingNameDoc = await getDocs(usrnmQuery);
		const existingEmailDoc = await getDocs(emailQuery);
		if (existingNameDoc.size > 0) {
			console.log("Nome de usuário já existe!");
			res.status(202).send("Non-original username");
		}
		else if (existingEmailDoc.size > 0) {
			console.log("Endereço de email já está em uso!");
			res.status(202).send("Email in use");
		}
		else {
			const docRef = await addDoc(getUsers(), {
			username: username,
			password: password,
			firstname: firstname,
			lastname: lastname,
			email: email,
			date: date
			});
	
			res.status(200).send(new User(firstname, lastname, email, date));
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).send(error.message);
	}
});

export default router;
