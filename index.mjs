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
app.post("/chat", async (req, res) => {
  const db = initializeFirebase();

  const { chatID, userID, msg } = req.body;
  var userFlag = true;
  var timeStamp = Date.now();
  var chatExists = false;

  if (chatID !== undefined && chatID !== "") {// Se chatID estiver presente, significa que o chat já existe
    const querySnapshot = await getDocs(collection(db, "chats"));
    querySnapshot.forEach((doc) => {
      if (doc.id == chatID) {
        chatExists = true;
      }
    });
    // Lógica para adicionar a mensagem ao chat existente
    if (chatExists) {
      console.log(`Adicionando mensagem ao chat ${chatID}`);
      try { //Envio de mensagem
        const msgDocRef = await addDoc(collection(db, "messages"), {
          chatID,
          msg,
          timeStamp,
          userFlag
        });
        console.log("Nova mensagem enviada com o ID: ", msgDocRef.id);
      } catch (error) {
        console.error("Erro ao enviar mensagem: ", error)
        res.status(500).send("Erro ao enviar mensagem");
      }
      res.status(200).send("OK");
    } else {
      res.status(401).send("ID de chat não encontrado");
    }
  } else {// Se chatID não estiver presente, significa que o chat não existe
    console.log("Criando um novo chat e adicionando mensagem");
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        userID
      });
      const newChatID = docRef.id;
      console.log("Novo chat criado com o ID: ", newChatID);
      
      try { //Envio de mensagem
        const msgDocRef = await addDoc(collection(db, "messages"), {
          newChatID,
          msg,
          timeStamp,
          userFlag
        });
        console.log("Nova mensagem enviada com o ID: ", msgDocRef);
      } catch (error) {
        console.error("Erro ao enviar mensagem: ", error)
        res.status(500).send("Erro ao enviar mensagem");
      }      
      res.status(200).send("OK");
    } catch (error) {
      console.error("Erro ao criar um novo chat:", error);
      res.status(500).send("Erro ao criar um novo chat");
    }
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
