import {useState, useEffect} from 'react'
import {projectAuth, googleProvider, githubProvider, twitterProvider} from '../firebase/config'
import {useAuthContext} from './useAuthContext'

export const useSocialAuth = () => {

    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false) // For Cleanup 
    const {dispatch} = useAuthContext() 

    const socialSignup = async (provider) => {

        setError(null)
        setIsPending(true)

        try {
            const res = await projectAuth.signInWithRedirect(provider)

            // Not getting a response at all (example network connection)
            if(!res){
                throw new Error('Could not complete signup')
            }

            
            dispatch({type: 'LOGIN', payload: res.user})

            // Check for cancellation
            if(!isCancelled){ 
                setIsPending(false)
                setError(null)
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


    return {socialSignup, googleProvider, githubProvider, twitterProvider, error, isPending}
}