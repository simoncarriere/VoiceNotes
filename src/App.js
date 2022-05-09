import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import {useState} from 'react'

// Componenents
import Navbar from './components/Navbar.js'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Forgot from './pages/Forgot'
import AccountSettings from './pages/AccountSettings'

// Hooks
import { useAuthContext } from './hooks/useAuthContext';

export default function App() {

  const {authIsReady, user} = useAuthContext()
  const [darkMode,setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>
      {authIsReady && ( 
        <BrowserRouter>
          <div className={darkMode ? 'dark' : '' }>
            <div className=" dark:text-white min-h-screen bg-gradient-to-r from-orange-100 via-slate-100 to-ingido-50 dark:from-indigo-900 dark:to-slate-800">
              <div className=" dark:text-white">
                  <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
                  <Switch>

                    {/* User Logged in */}
                    <Route exact path="/">
                      {user ? <Redirect to="/dashboard" /> : <Home/>}
                    </Route>
                    <Route exact path="/dashboard">
                      {user ? <Dashboard /> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/account-settings">
                      {user ? <AccountSettings /> : <Redirect to="/login"/>}
                    </Route>

                    {/* User Loggout out */}
                    <Route path="/login">
                      {!user ? <Login /> : <Redirect to="/dashboard"/>}
                    </Route>
                    <Route path="/signup">
                      {!user ? <Signup /> : <Redirect to="/dashboard"/>}
                    </Route>
                    <Route path="/forgot">
                      {!user ? <Forgot /> : <Redirect to="/dashboard"/>}
                    </Route>

                  </Switch>
                </div>
              </div>
            </div>
        </BrowserRouter>
      )}
    </>
  )
}