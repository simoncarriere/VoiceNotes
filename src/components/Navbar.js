import {Link} from 'react-router-dom'

// Hooks
import {useLogout} from '../hooks/useLogout'
import {useAuthContext} from '../hooks/useAuthContext'

// Componenents
import Settings from './Settings'
  
export default function Navbar({toggleDarkMode, darkMode}) {

    const {user} = useAuthContext()
    const {logout} = useLogout()


    return (
        <nav aria-label="Top" className="fixed top-0 right-0 px-8 py-6">
            {!user && (
                <div className="ml-10 space-x-4">
                    <Link to="login" className="btn-light">Log in</Link>
                    <Link to="signup" className="btn-dark">Sign up</Link>
                </div>
            )}
            {user && (
                <div>
                    <Settings logout={logout} user={user} toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
                </div>
            )}

        </nav>
    )
  }
  