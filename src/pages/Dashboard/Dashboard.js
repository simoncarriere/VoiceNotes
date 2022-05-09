import {useState} from 'react'

// Hooks
import {useAuthContext} from '../../hooks/useAuthContext'

// Components
import Sidebar from './Sidebar'
import Todos from './Todos'

const Dashboard = () => {
  
  const {user} = useAuthContext()
  const [activeList, setActiveList] = useState('All Todos')
  
  return ( 
    <main className="p-8 h-screen flex flex-row">

        {/* Sidebar of todo categories*/}
        <div className="basis-1/2 lg:basis-1/3 xl:basis-1/4">
          <Sidebar uid={user.uid} activeList={activeList} setActiveList={setActiveList} />
        </div>

        {/* Individual todos */}
        <div className="basis-1/2 xl:bases-2/4 sm:mx-12 xl:mx-36 mt-8">
          <Todos uid={user.uid} activeList={activeList} setActiveList={setActiveList}/>
        </div>

    </main>
  );
}
 
export default Dashboard;