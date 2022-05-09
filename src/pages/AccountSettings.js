import {useState} from 'react'

// Hooks
import {useAuthContext} from '../hooks/useAuthContext'
import {useUpdate} from '../hooks/useUpdate'

// Components
import FormInput from '../components/FormInput'
import Modal from '../components/Modal'

// Icons
import {CheckCircleIcon, XCircleIcon,BadgeCheckIcon, MailIcon} from '@heroicons/react/solid'

export default function AccountSettings() {

    const {user} = useAuthContext()

    // Email Settings
    const [email, setEmail] = useState('')
    const {updateEmail, error, isPending, success} = useUpdate()
    const [emailVerification, setEmailVerification] = useState({success: false, error:'', isPending: false})
    
    // Password Reset Settings
    const [passwordValues, setPasswordValues] = useState({password:"", confirmPassword:"", error:"", success:"", pending: false})

    // Modal used to desactivation confirmation
    const [openModal, setOpenModal] = useState({show: false, errorMessage: ''})

    // Reset Passwords Input Fields
    const PasswordInputs = [
        {
          id: 1,
          name: "password",
          type: "password",
          placeholder: "New Password",
          errormessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          label: "Reset Password",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          autoComplete: 'off',
        },
        {
          id: 2,
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm New Password",
          errormessage: "Passwords don't match!",
          label: null,
          pattern: passwordValues.password,
          autoComplete: 'off',
        },
    ]; 

    // ✅ Done 
    const updateUserEmail = (e) => {
        e.preventDefault();
        updateEmail(email)
    }
    // ❌ TODO : Move Function to useUpdate Hook
    const verifyEmail = (e) => {
        e.preventDefault()

        setEmailVerification({success: false, error: '', isPending: true})

        user.sendEmailVerification().then(() => {
            setEmailVerification({success: true, error: '', isPending: false})
        }).catch((err) => {
            setEmailVerification({success: false, error: err.message, isPending: false})
        })
    }

    // ❌ TODO : Move Function to useUpdate Hook
    const resetPassword = async (e) => {

        e.preventDefault()

        setPasswordValues({...passwordValues, error: "", success: "", pending: true,})
        
        // Check for empty input feilds 
        if(passwordValues.password && passwordValues.confirmPassword){
            // Check for password match
            if (passwordValues.password === passwordValues.confirmPassword){

                user.updatePassword(passwordValues.password).then(() => {

                    setPasswordValues({password:'', confirmPassword:'', error: "", success: 'Password Successfully Updated', pending: false})
                    console.log('Pasword reset succesful')

                }).catch((error) => {
                    setPasswordValues({...passwordValues, error: error.message, pending: false});
                })
            } else {
                setPasswordValues({...passwordValues, error: 'Please make sure your passwords match', success: ""});
            }
        } else {
            setPasswordValues({...passwordValues, error: 'Please do not leave fields blank', success: ""});
        }
    }

    // ❌ TODO : Check if file is jpeg or gif and is bellow size restriction, update photo on firebase bucket, match photo to user id, manage error, display success message
    const updatePhoto = () => {
        console.log('Photo Successfully Updated')
    }

    // ✅ Done 
    const deleteUser = () => {
        user.delete().then(() => {
            console.log('User successfully deleted')
        }).catch((error) => {
            setOpenModal({show: true, errorMessage: error.message})
        });
    } 

    // 🔧 BUG : Modal not recognizing dark mode toggle
    const toggleModal = () => {
        setOpenModal({show: !openModal.show, errorMessage: ''})
    }  

    return ( 
        <div className="py-10 max-w-7xl mx-auto">
            <header>
                <h1>Account Settings</h1>
            </header>
            <main className="px-4 py-8 sm:px-0">

                {/* Email */}
                <form onSubmit={verifyEmail} autoComplete="off" className="sm:grid sm:grid-cols-3 sm:gap-4 py-12">
                        <label htmlFor="email" className="label">
                            {user.email ? 'Update Email' : 'Add Email to Account'}
                        </label>
                        <div>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="peer input-field dark:input-field-dark"
                                    placeholder={user.email ? user.email : 'Your Email...'}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    autoComplete="off"
                                />
                                {user.emailVerified && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <BadgeCheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                </div>
                                )}
                            </div>
                          
                            {/* Email Error Message */}
                            {error && (
                                <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800">
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
                            {/* Email Verification Error Message */}
                            {emailVerification.error && (
                                <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800 mt-2">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{emailVerification.error}</h3>
                                        </div>
                                    </div>
                                </div>
                                
                            )}
                            {/* Email Success Message */}
                            {success && (
                                <div className="rounded-md bg-green-100 dark:bg-green-800 p-4 sm:col-start-2 ">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800 dark:text-green-100">Email Successfully Updated</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Email Verification Success Message */}
                            {emailVerification.success && (
                                <div className="rounded-md bg-green-100 dark:bg-green-800 p-4 sm:col-start-2 mt-2">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800 dark:text-green-100">Email Verification Send!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex mt-4">
                                {/* Email Update */}
                                {isPending ? (
                                    <button disabled type="button" className="btn-light dark:btn-dark w-36">
                                        <svg role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                                        </svg>
                                        Loading...
                                    </button>
                                ) : (
                                    <button className="btn-light dark:btn-dark" onClick={updateUserEmail}>
                                        {user.email ? 'Update' : 'Save Email'}
                                    </button>
                                )}
                                {/* Email Verification */}
                                {(user.email && !user.emailVerified) && (
                                        emailVerification.isPending ? (
                                            <button disabled type="button" className="btn-outline dark:btn-dark w-36 ml-4">
                                                <svg role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                                                </svg>
                                            Loading...
                                        </button>
                                        ) : (
                                            <button className="btn-outline dark:btn-outline-dark ml-4 flex text-gray-600" type="submit">
                                                <MailIcon className="mr-2 h-4 w-4 mt-1 " aria-hidden="true" />
                                                Verify Email
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                </form>
                
                {/* Password Reset */}
                <form onSubmit={resetPassword} autoComplete="off" className="sm:border-t sm:border-gray-200 py-12 dark:sm:border-gray-700">
                    {PasswordInputs.map((input) => (
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4" key={input.id}>
                            <label className="label">{input.label}</label>
                            <FormInput
                                {...input}
                                value={passwordValues[input.name]}
                                onChange={(e) => setPasswordValues({...passwordValues, [e.target.name]: e.target.value })}
                            />
                        </div>
                    ))} 
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 " >
                        {/* Password Reset Success Message */}
                        {passwordValues.success && (
                            <div className="rounded-md bg-green-100 dark:bg-green-800 p-4 sm:col-start-2 ">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800 dark:text-green-100">{passwordValues.success}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Password Reset Error Message */}
                        {passwordValues.error && (
                            <div className="rounded-md bg-red-50 p-4 sm:col-start-2 dark:bg-red-800">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{passwordValues.error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}
                        {passwordValues.pending ? (
                            <button disabled type="button" className="btn-light dark:btn-dark sm:col-start-2 w-36">
                                <svg className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                                </svg>
                                Loading...
                            </button>
                        ) : (
                            <button className="btn-light sm:col-start-2 w-48 dark:btn-dark" type='submit'>Reset Password</button> 
                        )}
                    </div>
                </form>
         

                {/* Profile Photo */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 py-12 dark:sm:border-gray-700">
                    <label htmlFor="photo" className="label">
                    {user.photoURL ? 'Change' : 'Upload'} Profile Photo
                    </label>
                    <div className="sm:col-span-2">
                        <div className="flex items-center">
                            {user.photoURL ? (
                                <img
                                    className="inline-block h-16 w-16 rounded-full"
                                    src={user.photoURL}
                                    alt="profile"
                                />
                            ) : (
                                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            )}
                            <form>
                                <label className="block">
                                    {/* Add Submit button, if file change button to submit */}
                                    <span className="sr-only">
                                        Choose profile photo
                                    </span>
                                    <input type="file" className="ml-4 block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                                    file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 file:cursor-pointer" onClick={updatePhoto}/>
                                </label>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Delete Account */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 py-12 dark:sm:border-gray-700">
                    <label>
                        Desactivate Your Account
                    </label>
                    {openModal.show && <Modal openModal={openModal} toggleModal={toggleModal} deleteAction={deleteUser}/>}
                    <button
                        type="button"
                        className="inline-block justify-center rounded-md border border-transparent shadow-sm  py-3 bg-red-600 dark:bg-red-700 text-base font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                        onClick={toggleModal}
                        >
                        Deactivate
                    </button>
                </div>

            </main>
        </div>
    )
}