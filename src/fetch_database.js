
// =================================== FIREBASE ===================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

export function fetchData() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyA1J5oEELCYV4N0Sd_skLk68JLGMwQerdQ",
      authDomain: "babelrevolution.firebaseapp.com",
      projectId: "babelrevolution",
      storageBucket: "babelrevolution.appspot.com",
      messagingSenderId: "360685414071",
      appId: "1:360685414071:web:e3c8d49460074f9fdc4f32",
      measurementId: "G-H390V8NZ3B",
      databaseURL: "https://babelrevolution-default-rtdb.europe-west1.firebasedatabase.app/",
      };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    
    // Initialize Realtime Database and get a reference to the service
    const database = getDatabase(app);
  
    return new Promise((resolve, reject) => {
      const nodes_data = ref(database, 'nodes');
  
      onValue(nodes_data, (snapshot) => {
        const nodes = snapshot.val();
  
        resolve({ nodes: nodes, database: database })});
      }, (error) => {
        reject(error); // rejeter la promesse en cas d'erreur
      });
    };