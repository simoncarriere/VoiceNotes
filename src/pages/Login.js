import {useState} from 'react'
import {Link} from 'react-router-dom'

// Hooks
import {useLogin} from '../hooks/useLogin'
import {useSocialAuth} from '../hooks/useSocialAuth'

// Componenents
import SocialLogins from '../components/SocialLogins'
import FormInput from '../components/FormInput'

//Icons
import {XCircleIcon} from '@heroicons/react/solid'


export default function Login() {

    const [values, setValues] = useState({email:"", password:"", errorMessage: ""})
    const {login, error, isPending} = useLogin()

    // Log in Fields Input 
    const Inputs = [
        {
          id: 1,
          name: "email",
          type: "email",
          placeholder: "Email",
          errormessage: "It should be a valid email address!",
          label: "Email",
        },
        {
          id: 2,
          name: "password",
          type: "password",
          placeholder: "Password",
          errormessage: "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          label: "Password",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
        },
    ]; 

    const handleSubmit = (e) => {
      e.preventDefault()
      setValues({...values, errorMessage:""})
      if (values.email.length > 1 && values.password.length > 1){
        login(values.email, values.password)
      } else {
        setValues({...values, errorMessage:"Cannot leave fields blank"})
      }
    }

    // Social Signup
    const {socialSignup, googleProvider, githubProvider, twitterProvider} = useSocialAuth()
    const handleSocialAuth = (provider) => {
        socialSignup(provider)
    }

    return ( 
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center">Welcome Back</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
              
              <input type="hidden" name="remember" defaultValue="true" /> 

              {/* Login Form Inputs */}
              <div className="-space-y-px">
                  {Inputs.map((input) => (
                    <div key={input.id}>
                      <FormInput
                          {...input}
                          value={values[input.name]}
                          onChange={(e) => setValues({...values, [e.target.name]: e.target.value })}
                      />
                    </div>
                  ))}
              </div>

              <SocialLogins providers={{googleProvider, githubProvider, twitterProvider}} handleSocialAuth={handleSocialAuth} />
              
              {/* Login Submit */}
              <div>
                {error && (
                  <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800 mb-4">
                      <div className="flex">
                          <div className="flex-shrink-0">
                              <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                          </div>
                      </div>
                  </div>
                )}
                {values.errorMessage && (
                  <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800 mb-4">
                      <div className="flex">
                          <div className="flex-shrink-0">
                              <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{values.errorMessage}</h3>
                          </div>
                      </div>
                  </div>
                )}
                {!isPending ? (
                  <button
                    type="submit"
                    className="btn-dark w-full py-4"
                  >
                    Log in
                  </button>
                ) : (
                  <button disabled type="button" className="btn-light dark:btn-dark w-full py-4">
                    <svg role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    Loading...
                  </button>
                )}
              </div>
              {/* Forgot Password */}
              <div className="text-sm">
                <div className="w-full flex justify-center">
                    <Link to="forgot" className="font-sm text-gray-500 hover:text-gray-600">
                      Forgot your password?
                    </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
     );
}
 