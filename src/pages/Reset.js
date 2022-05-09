import {useState} from 'react'
import {projectAuth} from '../firebase/config.js'

// Hooks
// import {useForgot} from '../hooks/useForgot'

export default function Reset() {

    const [newPassword, setNewPassword] = useState('')

    const resetPassword = async (newPassword) => {
        try {
            await projectAuth.verifyPasswordResetCode(newPassword)

        } catch(err) {
             console.log(err.message)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        resetPassword(newPassword)
    }

    return ( 
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-2xl font-base text-gray-900">Recover your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="sr-only">
                            Reset your Password 
                            </label>
                            <input
                                id="password"
                                name="password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                type="password"    
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-3"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn-dark w-full py-4"
                        >
                            Update Password
                        </button>
                    </div>       
                </form>
            </div>
        </div>
     );
}
 