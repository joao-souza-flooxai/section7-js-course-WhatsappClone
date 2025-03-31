const firebase = require('firebase');
require('firebase/firestore');

export class Firebase{

    constructor(){

        this._config = {
           
            apiKey: "AIzaSyDCbA1z6YwoiWj9LGFXOuOU7SsP4xgRvek",
            authDomain: "whatsapp-clone-5e00f.firebaseapp.com",
            projectId: "whatsapp-clone-5e00f",
            storageBucket: "whatsapp-clone-5e00f.firebasestorage.app",
            messagingSenderId: "679326433941",
            appId: "1:679326433941:web:a791d51df04797ae69119c"
              
        };
        this.init();


    }

    init(){ 
        // Initialize Firebase
        if(!window._initializedFirebase){
            this._initialized = true;
            firebase.initializeApp(this._config);
        
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;
        }
    }

    static db(){

        return firebase.firestore();


    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){
        return new Promise((s,f)=>{

            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
            .then(result=>{

                let token = result.credential.accessToken;
                let user = result.user;

                s({user, token});

            })
            .catch(err=>{
                f(err);
            });

        });
    }

}