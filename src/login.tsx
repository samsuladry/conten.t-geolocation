import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "./firebase";

const Login = () => {
  useEffect(() => {
    // Since Firebase v9 and above services are imported when needed instead of being a namespace
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(app));

    ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: "/home",
      signInOptions: [
        // {
        //   provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //   clientId:process.env.REACT_APP_GOOGLE_CLIENT_ID,
        // },
        // {
        //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        },
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    });
  }, []);

  return <div id="firebaseui-auth-container"></div>;
}

export default Login;
