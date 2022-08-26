import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
  apiKey: "AIzaSyDRg65KH22tUg0R3_p0XYX2HQd1jGL-Zr4",
  authDomain: "pomodoroapp-5a290.firebaseapp.com",
  projectId: "pomodoroapp-5a290",
  storageBucket: "pomodoroapp-5a290.appspot.com",
  messagingSenderId: "405522120817",
  appId: "1:405522120817:web:151899708bad4542169bd0"
})

export const auth = app.auth()
export default app
