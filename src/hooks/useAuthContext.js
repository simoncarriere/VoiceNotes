import {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'

// Simple Hook to access our Auth Context in required components
export const useAuthContext = () => {

    // Consume our context containing :
    // 1. User property
    // 2. Dispatch function
    const context = useContext(AuthContext)

    // Good check for component subtree to make sure its inside the right scope
    if (!context){
        throw Error('useAuthContext must be inside an AuthContextProvider')
    }
    
    return context
}
 
