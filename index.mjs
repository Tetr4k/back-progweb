import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';

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
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//const db = getFirestore(app);

const app = express();
app.use(express.json());

const initializeFirebase = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  return getFirestore(firebaseApp);
};


//Cadastro
app.post("/cadastra", async (req, res) => {
  const db = initializeFirebase();

  try {
    const { username, password, firstname, lastname, email } = req.body;

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
  const db = initializeFirebase();
  const { username, password } = req.body;

  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.get("password") == password) {
      res.status(200).send("OK");
    }
  });
  res.status(401).send("Unauthorized");
});


//Msg em chat vazio
app.post("/mensagem", async (req, res) => {
  const db = initializeFirebase();
  const { chatid, userid, mensagem } = req.body;

  try {
    const docRef = await getDoc(collection(db, "chats"), chatid);
    const chat = docRef.data();

    if (!chat) {
      res.status(404).send("Chat not found");
    } else {
      chat.mensagens.push({ userid, mensagem });
      await updateDoc(docRef.ref, chat);
      res.status(200).json(chat);
    }
  } catch (e) {
    console.error("Error adding message: ", e);
    res.status(500).send("Error");
  }
});

//Msg em chat existente
app.get("/chat/:chatid", async (req, res) => {
  const db = initializeFirebase();
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
app.put("/chat/:chatid", async (req, res) => {
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
app.delete("/chat/:chatid", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});