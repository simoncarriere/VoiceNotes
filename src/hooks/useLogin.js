import {useState, useEffect} from 'react';
import {projectAuth} from '../firebase/config.js'
import {useAuthContext} from './useAuthContext'

// We can use this hook in other components to invoke login function from firebase and local state
export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false) //Cleanup
    const {dispatch} = useAuthContext()

    const login = async (email,password) => {
        setError(null)
        setIsPending(true)

        // Sign the user in 
        try {
            const res = await projectAuth.signInWithEmailAndPassword(email,password)

            // Dispatch login Action, payload response from firebase method
            dispatch({type:'LOGIN', payload: res.user})

            // Update state
            // Only update state if setIsCancelled is false (before cleanup)
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        } catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    // Cleanup Function will only return on component unmount (Cancel pending async request)
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {login, error, isPending}
}