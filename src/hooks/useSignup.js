import {useState, useEffect} from 'react'
import {projectAuth} from '../firebase/config'
import {useAuthContext} from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false) //Cleanup function
    const {dispatch} = useAuthContext() 

    // Firebase auth allows us to use & set certain properties (Coming from our form feilds)
    const signup = async(email, password, displayName, passwordConfirmation) => {
        // Reset Error State
        setError(null)
        setIsPending(true)

        try {
            if(password===passwordConfirmation) {
                // Create User using firebase auth method
                const res = await projectAuth.createUserWithEmailAndPassword(email, password)

                // Not getting a response at all (example network connection)
                if(!res){
                    throw new Error('Could not complete signup')
                }

                // Add Display name to user name
                await res.user.updateProfile({displayName: displayName})

                // Dispatch login Action via our useAuthContext Hook
                dispatch({type: 'LOGIN', payload: res.user})

                // Check for cancellation
                if(!isCancelled){ 
                    setIsPending(false)
                    setError(null)
                }
            } else {
                setIsPending(false)
                setError('Passwords do not match')
            }

        } catch (err) {
            // Example : Email taken or password too short 
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

    return {signup, error, isPending}

}