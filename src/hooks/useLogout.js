import {useState, useEffect} from 'react';
import {projectAuth} from '../firebase/config.js'
import {useAuthContext} from './useAuthContext'

// We can use this hook in other components to invoke logout function from firebase and local state

export const useLogout = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false) //Cleanup
    const {dispatch} = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        // Sign the user Out 
        try {
            await projectAuth.signOut()

            // Dispatch logout Action to our Context, no payload required
            dispatch({type:'LOGOUT'})

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

    return {logout, error, isPending}
}