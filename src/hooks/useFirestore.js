import {useReducer, useEffect, useState} from 'react'
import {projectFirestore, timestamp} from '../firebase/config'

let initialState = {
    document:null,
    isPending:false,
    error:null,
    success:null
}

const firestoreReducer = (state, action) => {
    switch(action.type){
        case 'IS_PENDING':
            return {...state, isPending: true, document: null, success: false, error: null}
        case 'ADDED_DOCUMENT':
            return {...state, isPending: false, document:action.payload, success:true, error:null}
        case 'DELETED_DOCUMENT':
            return {...state, isPending: false, document:null, success:true, error:null}
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null}
        case 'ERROR':
            return {...state, isPending: false, document:null, success:false, error:action.payload}
        default:
            return state
    }
}

// Hook to Add or Remove docs to our firestore collection
export const useFirestore = (collection) => {

    // Response state represents the state response from our firestore when we make a request
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled,setIsCancelled] = useState(false) // For our Cleanup Function

    // Collection reference
    const ref = projectFirestore.collection(collection)

    // Only dispatch if not cancelled (if the component hasnt unmounted)
    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled){
            dispatch(action)
        }
    }

    // Add a document
    const addDocument = async (doc) => {
        dispatch({type:'IS_PENDING'})
        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({...doc, createdAt})
            dispatchIfNotCancelled({type: 'ADDED_DOCUMENT', payload: addedDocument})
        } catch (err){
            dispatchIfNotCancelled({type: 'ERROR', payload: err.message})
            console.log(err.message)
        }
    }

    // Delete a document
    const deleteDocument = async (id) => {
        dispatch({type:'IS_PENDING'})
        try {
            await ref.doc(id).delete()
            dispatchIfNotCancelled({type: 'DELETED_DOCUMENT'})
        } catch (err){
            dispatchIfNotCancelled({type: 'ERROR', payload: 'coloud not delete'})
        }
    }

    // update document
    const updateDocument = async (id, updates) => {
        dispatch({type: 'IS_PENDING'})

        try {
            const updateDocument = await ref.doc(id).update(updates)
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updateDocument})
            return updateDocument
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: err.message})
            return null
        }
    }

    // Cleanup (if component unmounts, cancel any ongoing request)
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {addDocument, deleteDocument, updateDocument, response}
}