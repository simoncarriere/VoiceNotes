import {useState, useEffect} from 'react'

// Firebase
import {projectAuth} from '../firebase/config.js'

export default function Forgot() {

    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false) //Cleanup

    const forgot = async (email) => {
        setError(null)
        setIsPending(true)

        // Send User Reset Email
        // You can customize the Password Reset email under: Firebase Console -> Auth -> Email Templates -> Password Reset 
        try {
            await projectAuth.sendPasswordResetEmail(email)

            // Only update state if setIsCancelled is false (before cleanup)
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
        } catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        forgot(email)
    }

    // Cleanup Function will only return on component unmount (Cancel pending async request)
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])
   
    return ( 
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8"> 
                <div>
                    <h2 className="mt-6 text-center text-2xl font-base text-gray-900">Recover your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="sr-only">
                            Email 
                            </label>
                            <input
                                id="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"    
                                autoComplete="email"
                                required
                                className="input-field"
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div>
                        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                        {!isPending ? (
                            <button
                                type="submit"
                                className="btn-dark w-full py-4"
                            >
                                Send recovery email
                            </button>
                        ) : (
                            <button
                                type="text"
                                disabled
                                className="btn-light w-full py-4"
                            >
                                Sending...
                            </button>
                        )}
                    </div>       
                </form>
            </div>
        </div>
     );
}
 