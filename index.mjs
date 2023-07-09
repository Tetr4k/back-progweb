import express from "express";
import { firebaseConfig, port } from './config.mjs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';

const app = express();
app.use(express.json());

const initializeFirebase = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  return getFirestore(firebaseApp);
};

app.get("/health", async (req, res) => {
  console.log("get health");
  res.status(200).send();
})

//Cadastro
app.post("/cadastra", async (req, res) => {
  const db = initializeFirebase();

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
  const { username, password } = req.body;

  try{
    const db = initializeFirebase();
    const usersCollection = collection(db, "users");
    const usersRef = query(usersCollection, where("username", "==", username), where("password", "==", password));
    const userDoc = await getDocs(usersRef);
    const userData = userDoc.docs[0];

    res.status(200).send(userData ? userData.id : false);
  }
  catch (error){
    console.log(error);
    res.status(401).send(error);
  }
});

//Mensagem
app.post("/", async (req, res) => {
  const { chatID, userID, message, timeStamp } = req.body;

  try{
    const db = initializeFirebase();

    const chatsCollection = collection(db, "chats");
    const messagesCollection = collection(db, "messages");

    let newChatID;

    if (!chatID) {
      const docRef = await addDoc(chatsCollection, {
        userID
      });
      newChatID = docRef.id;
    }
    newChatID = chatID ? chatID : newChatID

    const msgDocRef = await addDoc(messagesCollection, {
      chatID: newChatID,
      message: message,
      timeStamp: timeStamp,
      userFlag: true
    });

    const messagesRef = query(messagesCollection, where("chatID", "==", newChatID))
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

    res.status(200).send({
      chatID: newChatID,
      messages: messages
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Abrir chat
app.put("/:chatid", async (req, res) => {
  const db = initializeFirebase();

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
  const db = initializeFirebase();

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
