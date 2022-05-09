import {useState, useEffect} from 'react'
import {timestamp} from '../../firebase/config'

//Hooks
import {useFirestore } from '../../hooks/useFirestore'
import {useCollection} from '../../hooks/useCollection'

// Components
import Todo from './Todo'
import Modal from '../../components/Modal'

// External Libraries
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

//Icons
import {XCircleIcon, DotsHorizontalIcon} from '@heroicons/react/solid'

export default function Todos({uid, activeList, setActiveList}) {

    // Track state of todo input
    const [newTodo, setNewTodo] =  useState({todo: '', success: false, error:null, isPending: false})

    // Track state of todos in specific List
    const [filtered, setFiltered] = useState()

    // Modal used to list deletion
    const [openModal, setOpenModal] = useState({show: false, errorMessage: null, title:''})

    // Filter out users todo, filter by DnD Position
    const {documents, error} = useCollection('Todos',['uid', '==', uid],['position']) 
    const {addDocument, response, deleteDocument:deleteTodo, updateDocument} = useFirestore('Todos')

    const {documents: lists} = useCollection('Collections')
    const {deleteDocument} = useFirestore('Collections')

    // ✅ Add new todo in firebase collection
    const handleNewTodo = async (e) => {
        e.preventDefault()

        setNewTodo({todo: '', success: false, error:null, isPending: true})

        // Make sure input field isnt empty
        if (newTodo.todo.length > 2){
            // Add New To Firebase
            await addDocument({
                todo: newTodo.todo, 
                uid, 
                list:activeList, 
                checked: false,
                createdAt: timestamp.fromDate(new Date()),
                position: null
            })
            
            if (!response.error){
                setNewTodo({todo: '', success:true, error: null, isPending:false})
                console.log(newTodo + ' added successfully')
            } else {
                setNewTodo({todo: '', success:false, error: response.error, isPending:false})
            }
        } else {
            setNewTodo({todo: '', success:false, error: 'Todo must be atleast 3 characters long', isPending:false})
        }
    }

    // ✅ Filter Todos by active List
    useEffect(() => {
        if (activeList === 'All Todos'){
            return setFiltered(documents)
        } else {
            let activeListId = documents.filter((i) => {
                return i.list === activeList
           })
           setFiltered(activeListId)
        }
    }, [activeList, documents])

    // ✅ Delete list
    const handleDeleteCategory = async () => {
        if (activeList === 'All Todos'){
            return 
        } else {

            // Filter out todos in active list 
            let filteredList = lists.filter((i) => {
                return i.name === activeList
            })

            try{
                // Delete Todos inside current list
                filtered.forEach((i) => {
                    deleteTodo(i.id)
                })
                // Delete List 
                deleteDocument(filteredList[0].id)
                // After deletion,bring user back to All Todos
                setActiveList('All Todos')
            }catch(err) {
                setOpenModal({show:true, errorMessage: err.message, ...openModal})
            }
        }
        toggleModal()
    }
    
    // ✅ Toggle Modal for list deletion
    const toggleModal = () => {
        setOpenModal({
            show: !openModal.show, 
            errorMessage: null, 
            title: activeList && `Delete ${activeList}`, 
            text: "Are you sure you want to delete this list? All of your associated todos will be permanently removed from our servers forever. This action cannot be undone."
        })
    }  

    // ✅ Conditional CSS based on state
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // ❌ Move todo too different list
    const handleOnDragEnd = async (result) => {

        // Takes in result which returns Draggable Id, its source and destination
        // console.log(result)

        // Prevent error when todo dragged outside of container
        if(!result.destination) return;

        // Create a local copy of our filtered list
        const items = Array.from(filtered)

        // Grabs the item we are dragging by retreiving its source index from our result prop and splicing it
        const [reorderItems] = items.splice(result.source.index, 1)
        // console.log(reorderItems) // Will return dragged item

        // Grabs the desination and adds our dragged item
        items.splice(result.destination.index, 0, reorderItems)
        setFiltered(items)

        // ❌ Checks if destination is a different list 
        // STEPS : 
        // 1. Grab the destination list
        // 2. Grab the drag items
        // 3. Update items's list value to destination list

        // Updates each todo's position value in firebase 
        items && items.forEach((i) => {
            let index = items.indexOf(i);
            updateDocument(i.id, {position: index})
        })
    }
    
    
    return (
        <div>

            {/* Title */}
            <div className="flex w-full  justify-between items-center">
                <h1>{activeList}</h1>
                {activeList !== 'All Todos' && (
                    // Only display menu icon on user created categories
                    <DotsHorizontalIcon className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-700" onClick={toggleModal}/>
                    )}
                    {openModal.show && <Modal openModal={openModal} toggleModal={toggleModal} deleteAction={handleDeleteCategory}/>}
            </div>

            {/* New Todo Input */}
            <form onSubmit={handleNewTodo}>
                <label htmlFor="todo" className="sr-only">
                    Todo
                </label>
                <input
                    type="text"
                    name="todo"
                    id="todo"
                    className="input-field border-none mt-8 bg-slate-200 opacity-60 p-5 focus:opacity-90 z-0"
                    placeholder="Add a new task"
                    onChange={(e) => setNewTodo({...newTodo, todo:e.target.value})}
                    value={newTodo.todo}
                />
                {newTodo.error && (
                    <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{newTodo.error}</h3>
                            </div>
                        </div>
                    </div>
                )}

            </form>

            {/* Map over todos */}
            <div className="divide-y divide-gray-200 overflow-scroll ">
                {filtered ? (
                    filtered.length === 0 ? (
                        <div className="w-full flex justify-center align-center mt-24 text-gray-400">
                            <p>Your work is done! Go grab a beer 🍺</p>
                        </div>
                    ) : (
                        
                        // React Beautiful Dnd context wrapper
                        // onDragEnd triggers function to reorder all of our items, gives you result object 
                        
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="characters"> 
                                {/* Provided will give you access to pass down props */}
                                {(provided) => (
                                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 mt-2">
                                        {filtered.map((todo, index) => (
                                            // Set DraggableId to todo's unique ID
                                            // Index = array position [0,1,2, ...]
                                            <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                            {(provided) => (
                                                    <li 
                                                        className={classNames(todo.checked && 'opacity-60 hover:opacity-70', "flex  w-full bg-white p-5 rounded-lg items-center ")} 
                                                        {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                                                    >
                                                        <Todo todo={todo}/>
                                                    </li>
                                            )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )) : (
                        <p className='opacity-70 flex w-full bg-slate-200 my-2 p-5 rounded-lg items-center cursor-pointer animate-pulse ml-2'>
                            <svg role="status" className="inline mr-4 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                            </svg>
                            Loading...
                        </p>
                )}
            </div>

            {/* Error */}
            {error && 
                <div className="w-full flex justify-center align-center py-12 text-gray-400">
                    <p>{error}</p>
                </div>
            }

        </div>
    )
}