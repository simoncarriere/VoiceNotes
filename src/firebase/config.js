import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDcuvu0auS8Vi3LLAV7tU0XWtkL0SALQ2M",
  authDomain: "udemy-financetracker.firebaseapp.com",
  projectId: "udemy-financetracker",
  storageBucket: "udemy-financetracker.appspot.com",
  messagingSenderId: "182020576541",
  appId: "1:182020576541:web:3cfa257ec1c9777cabfdf4",
  measurementId: "G-YXF66T1FZX"
  };

  //init firebase
  firebase.initializeApp(firebaseConfig)

  //init firebase services
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()

  const googleProvider = new firebase.auth.GoogleAuthProvider()
  const githubProvider = new firebase.auth.GithubAuthProvider()
  const twitterProvider = new firebase.auth.TwitterAuthProvider()

//   //Timestamp setup
  const timestamp = firebase.firestore.Timestamp

  export  {projectFirestore, projectAuth, timestamp, googleProvider, githubProvider, twitterProvider}