import {useState, useEffect} from 'react'

//Hooks
import {useFirestore } from '../../hooks/useFirestore'
import {useCollection} from '../../hooks/useCollection'

//Icons
import {XCircleIcon} from '@heroicons/react/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Sidebar({uid, activeList, setActiveList}) {
    
    const {addDocument, response} = useFirestore('Collections')
    const {documents: lists, error} = useCollection('Collections')
    const {documents: todos} = useCollection('Todos')     // Track number of todos in lists 
    
    // New List Input  
    const [newList, setNewList] = useState({list: '', success: false, error:null, isPending: false})

    // Individual list length state
    const [listLength, setListLength] = useState([])

    // Add new todo todo category on Firebase
    const handleAddCategory = async (e) => {
        e.preventDefault()
        setNewList({list:'',success:false, error:null, isPending:true})

        if (newList.list.length > 3){
            await addDocument({name:newList.list, uid})
            if (!response.error){
                setNewList({list:'', success:true, error:null, isPending: false})
                setActiveList(newList.list)
                console.log(newList + ' added successfully')
            } else {
                setNewList({list: '',success:false, error:response.error, isPending:false})
                console.log(newList + ' failed to add')
            }
        }else {
            setNewList({list: '', success:false, error: 'List must be atleast 4 characters long', isPending:false})
        }
    }

    // Count the number of todos left
    useEffect(() => {
        const counts = [];
        // Filter out checked todos
        const notDone = todos && todos.filter((i) => {
            return i.checked === false
        })
        const numberedList =  todos && notDone.map(i => i.list)
        numberedList && numberedList.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        setListLength(counts)
    },[todos])

    
    return (
      <nav className="h-full space-y-2 px-12 py-12 rounded-2xl bg-white dark:bg-slate-800 " aria-label="Sidebar">

        {/* All Todos */}
        <div 
            className={(classNames((activeList === 'All Todos') ? 'bg-slate-100' : 'bg-white', 'cursor-pointer text-gray-600 hover:bg-slate-100 hover:text-gray-900 group flex items-center px-6 py-4 text-sm font-medium rounded-lg'))}
            onClick={() => setActiveList('All Todos')}
        >
            <span className="truncate">All Todos</span>
            <span className='bg-slate-600 text-slate-50 group-hover:bg-slate-500 ml-auto inline-block py-1 px-3 text-xs rounded-md'>
                {todos ? todos.filter(i => !i.checked).length : 0}
            </span>
        </div>
        
        {/* Map over todo category - setActiveList */}
        {lists && lists.map((item) => (
                <div
                    key={item.id}
                    onClick={() => setActiveList(item.name)}
                    className={(classNames((activeList === item.name) ? 'bg-slate-100' : 'bg-white', 'cursor-pointer text-gray-600 hover:bg-slate-100 hover:text-gray-900 group flex items-center px-6 py-4 text-sm font-medium rounded-lg h-14'))}
                >
                    <span className="truncate">{item.name}</span>
                    {listLength && listLength[item.name] > 0 ? ( 
                        <span className='bg-slate-200 text-gray-600 group-hover:bg-slate-200 ml-auto inline-block py-1 px-3 text-xs rounded-md'>
                            <p>{listLength[item.name]}</p>   
                        </span>
                    ) : null} 
                </div>
            )
        )}
        {error && <p className="error-message">{error}</p>}
        
        {/* Add New List */}
        <form onSubmit={handleAddCategory}>
            <label htmlFor="todo" className="sr-only">
                Todo
            </label>
            <input
                type="text"
                name="todo"
                id="todo"
                className="input-field border-none bg-slate-100 px-6 py-4  rounded-lg placeholder-slate-400"
                placeholder="Create New List"
                onChange={(e) => setNewList({...newList, list:e.target.value})}
                value={newList.list}
            />
            {newList.error && (
                <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{newList.error}</h3>
                        </div>
                    </div>
                </div>
            )}
        </form>
      </nav>
    )
  }
