// Hooks
import {useFirestore} from '../../hooks/useFirestore'

// Icons
import {TrashIcon} from '@heroicons/react/solid'

export default function Todo({todo}) {

    const {deleteDocument, updateDocument} = useFirestore('Todos')

    const toggleCheck = async () => {
        let isChecked = todo.checked
        await updateDocument(todo.id, {
            checked: !isChecked
        });
    }

    const handleDeleteTodo = () => {
        deleteDocument(todo.id)
    }

    return (
        <>
            <input
                id="todo"
                aria-describedby="todo-description"
                name="todo"
                type="checkbox"
                className="focus:ring-red-500 h-5 w-5 text-red-600 border-none bg-slate-200 rounded ml-2 cursor-pointer"
                checked={todo.checked}
                onChange={toggleCheck}
            />
            <p className={todo.checked ? "ml-4 text-gray-500" : 'ml-4'}>{todo.todo}</p>
            {todo.checked && <p onClick={handleDeleteTodo} className="ml-auto text-red-500 h-4 w-4 cursor-pointer"><TrashIcon/></p>}
        </>
        
    )
}



