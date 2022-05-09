import {useEffect, createContext, useReducer} from 'react'
import { projectAuth } from '../firebase/config'

export const AuthContext = createContext()

// Mirror Firebase Auth State and our global auth state context
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            // Action for both Signing up and Loging in Users
            // Payload coming from our useSignup and useLogin Hook 
            return {...state, user: action.payload}
        case 'LOGOUT':
            return {...state, user:null}
        case 'AUTH_IS_READY':
            return {...state, user: action.payload, authIsReady:true}
        default:
            return state
    }
}

// Context that wraps our entire application, tracks user status and gives access to our reducer actions
export const AuthContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(authReducer, {
        user:null,
        // Checks if a logged in user is authenticated, while false, app wont render (Waits for response from firebase)
        // Prevents components not supposed to be shown to login/unauthenticated users to render 
        authIsReady: false 
    })


    // Checks Authentication Status
    // Will fire once when we first connect to firebase and on every auth state change from firebase
    // Without this, user auth will default as null when we reload our application.
    // App waits to figure out if user logged in before we render content
    useEffect(() => {
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({type: 'AUTH_IS_READY',payload: user})
            // console.log('onAuthStateChanged ran')
        })
        // Cleanup (Cancel subscription to auth status)
        return() => unsub()
    },[])

    return ( 
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
     );
}
