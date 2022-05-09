import {Fragment} from 'react'
import { Menu, Transition } from '@headlessui/react'
import {Link} from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Settings({logout, user, toggleDarkMode, darkMode}) {

  return (
    <Menu as="div" className="relative inline-block text-left">

        {/* Profile Picture */}
        <Menu.Button>
            {user.photoURL ? (
                <img
                    className="inline-block h-14 w-14 rounded-full p-1 ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-red-300 ease-out duration-200"
                    src={user.photoURL}
                    alt="profile"
                />
            ) : (
                <span className="inline-block h-14 w-14 rounded-full overflow-hidden bg-slate-100">
                    <svg className="h-full w-full text-gray-300 " fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
            )}
        </Menu.Button>

        {/* Popup */}
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none ">
                {/* Signed in User */}
                <div className="px-4 py-4">
                    <p className="text-sm dark:text-gray-300">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.email ? user.email : user.displayName}</p>
                </div>
                {/* Appearence (Light/Day) */}
                <div className="block px-4 py-3 dark:hover:bg-gray-700 ">
                    <span className="sr-only">Set Theme</span>   
                    <p onClick={toggleDarkMode} className=" text-sm flex cursor-pointer text-gray-700 dark:text-gray-200">Appearence 
                        {darkMode ? " (dark)" : " (light)"}
                    </p>
                </div>
                <div className="py-1">
                    {/* Account Settings */}
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                            to="/account-settings"
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                                'block px-4 py-3 text-sm'
                            )}
                            >
                                Account Settings
                            </Link>
                        )}
                    </Menu.Item>
                    {/* Support */}
                    <Menu.Item>
                        {({ active }) => (
                            <a
                            href="https://twitter.com/simonsjournal"
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                                'block px-4 py-3 text-sm'
                            )}
                            >
                            Support
                            </a>
                        )}
                    </Menu.Item>
                    {/* Report */}
                    <Menu.Item>
                        {({ active }) => (
                            <a
                            href="https://github.com/simoncarriere/firebasetailwind-authboiler/issues"
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                                'block px-4 py-3 text-sm'
                            )}
                            >
                            Report Bug
                            </a>
                        )}
                    </Menu.Item>
                </div>
                {/* Logout */}
                <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                        <button
                            type="submit"
                            onClick={logout}
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                                'block w-full text-left px-4 py-3 text-sm'
                            )}
                        >
                            Sign out
                        </button>
                        )}
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Transition>
    </Menu>
  )
}














