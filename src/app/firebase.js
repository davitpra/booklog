// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUF-ZnGSwJZxNZ9T56yNfx1T-J-RquP7Q",
  authDomain: "movielog-a29c3.firebaseapp.com",
  projectId: "movielog-a29c3",
  storageBucket: "movielog-a29c3.firebasestorage.app",
  messagingSenderId: "1071583946988",
  appId: "1:1071583946988:web:d151740154e7383d2b5dc9"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore();

/**
 * Save a New Book in Firestore
 * @param {string} title the title of the Book
 * @param {string} author the author of the Book
 * @param {string} genre the genre of the Book
 * @param {string} raiting the Raiting of the Book
 */

export const saveBook = (title, author, genre, raiting) =>
  addDoc(collection(db, "books"), { title, author, genre, raiting });

export const onGetBooks = (callback) =>
  onSnapshot(collection(db, "books"), callback);

/**
 *
 * @param {string} id Book ID
 */
export const deleteBook = (id) => deleteDoc(doc(db, "books", id));

export const getBook = (id) => getDoc(doc(db, "books", id));

export const updateBook = (id, newFields) =>
  updateDoc(doc(db, "books", id), newFields);

export const getBooks = () => getDocs(collection(db, "books"));
