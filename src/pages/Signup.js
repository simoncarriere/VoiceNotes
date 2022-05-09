import {useState} from 'react'
import {Link} from 'react-router-dom'

// Hooks
import {useSignup} from '../hooks/useSignup'
import {useSocialAuth} from '../hooks/useSocialAuth'

// Componenents
import SocialLogins from '../components/SocialLogins'
import FormInput from '../components/FormInput'

//Icons
import {XCircleIcon} from '@heroicons/react/solid'

export default function Signup() {

    const [values, setValues] = useState({displayName: "", email:"", password:"", passwordConfirmation: "", errorMessage: ""})
    const {signup, isPending, error} = useSignup()

    // Sign Up Fields Input
    const Inputs = [
        {
            id: 1,
            name: "displayName",
            type: "text",
            placeholder: "Full Name",
            errormessage: "It should be a valid email address!",
            label: "Full Name",      
            autoComplete: 'off',
        },
        {
            id: 2,
            name: "email",
            type: "email",
            placeholder: "Email",
            errormessage: "It should be a valid email address!",
            label: "Email",
            autoComplete: 'off',
        },
        {
            id: 3,
            name: "password",
            type: "password",
            placeholder: "Password",
            errormessage:
              "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
            label: "Password",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
            autoComplete: 'off',
          },
          {
            id: 4,
            name: "passwordConfirmation",
            type: "password",
            placeholder: "Confirm Password",
            errormessage: "Passwords don't match!",
            label: null,
            pattern: values.password,
            autoComplete: 'off',
          },
    ]; 
    
    const handleEmailAuth = (e) => {
        e.preventDefault()
        
        setValues({...values, errorMessage:""})
        if (values.displayName.length > 1 && values.email.length > 1 && values.password.length > 1 && values.passwordConfirmation.length > 1){
            signup(values.email, values.password, values.displayName, values.passwordConfirmation)
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
                    <h2 className="mt-6 text-center">Create your account</h2>
                </div>
                <form autoComplete="off" className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
                    <input type="hidden" name="remember" defaultValue="true" />

                    {/* Login Form Inputs */}
                    <div className="rounded-md shadow-sm -space-y-px">
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

                    {/* Social Logins */}
                    <SocialLogins providers={{googleProvider, githubProvider, twitterProvider}} handleSocialAuth={handleSocialAuth} />

                    {/* Buttons & Errors */}
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
                            <button type="submit" className="btn-dark w-full py-4">Create your account</button>
                        ) : (
                            <button type="text" disabled className="btn-light w-full py-4" >loading...</button>
                        )}
                    </div>

                </form>

                {/* Link to Login */}
                <div className="w-full flex justify-center">
                    <Link to="/Login" className="font-sm text-sm text-gray-500 hover:text-gray-600">
                        Already have an account?
                    </Link>
                </div>
                
            </div>
        </div>
     );
}