import express from "express";
import { firebaseConfig, port } from './config.mjs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';

const app = express();
app.use(express.json());

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.get("/health", async (req, res) => {
  console.log("get health");
  res.status(200).send();
})

//Cadastro
app.post("/cadastra", async (req, res) => {

  try {
    const { username, password, firstname, lastname, email } = req.body;
//validar
    const docRef = await addDoc(collection(db, "users"), {
      username,
      password,
      firstname,
      lastname,
      email,
    });

    console.log("Document written with ID: ", docRef.id);
    res.status(200).send("OK");
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(500).send("Error");
  }
});

//Login
app.get("/login", async (req, res) => {
  var trigger = true;
  const db = initializeFirebase();
  const { username, password } = req.body;

  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.get("password") == password) {
      res.status(200).send("OK");
      trigger = false;
    }
  });
  if (trigger) {
    res.status(401).send("Unauthorized");
  }
});

//mensagem
app.get("/:chatid", async (req, res) => {
  const { chatid } = req.params;

  const docRef = await getDoc(collection(db, "chats"), chatid);
  const chat = docRef.data();


  if (chat) {
    res.status(200).json(chat);
  } else {
    res.status(404).send("Chat not found");
  }
});

//Abrir chat
app.put("/:chatid", async (req, res) => {
  const { chatid } = req.params;
  const { titulo } = req.body;

  const docRef = await getDoc(collection(db, "chats"), chatid);
  const chat = docRef.data();

  if (chat) {
    chat.titulo = titulo;
    await updateDoc(docRef.ref, chat);
    res.status(200).json(chat);
  } else {
    res.status(404).send("Chat not found");
  }
});

//Deletar chat
app.delete("/:chatid", async (req, res) => {
  const { chatid } = req.params;

  try {
    const docRef = await getDoc(collection(db, "chats"), chatid);
    const chat = docRef.data();

    if (chat) {
      await deleteDoc(docRef.ref);
      res.status(200).send("OK");
    } else {
      res.status(404).send("Chat not found");
    }
  } catch (e) {
    console.error("Error deleting chat: ", e);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
