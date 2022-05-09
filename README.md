# Firebase Autthentication Boilerplate with React & Tailwind

A tailwind & firebase authentication starting point for any future SASS projects. Designed using a custom hooks architecture. Development roadmap and feature features :

- [x] Email Signup with forget password
- [x] Social Logins (Google, Twitter, Github)
- [x] Tailwind Dark Mode
- [x] Social Auth Error Management
- [x] Settings page for account deletion, email update and password reset.
- [x] Email verification
- [ ] Welcome Email
- [ ] Update to Firebase v9
- [ ] Custom Reset Password page

## Setup

Required steps to reproduce project locally.

1. Update firebase config to match your project
2. Activate social auths on firebase and selected social platform
3. `npm start` : Runs the app in the development mode.

## Community & Support

For any questions, feedback or feature suggestions tweet at me [@simonsjournal](https://twitter.com/simonsjournal). For any bugs and errors you encounter create a new [Github Issue](https://github.com/simoncarriere/firebasetailwind-authboiler/issues/new).

## React Firebase Hooks - Auth

List of Auth hooks:

- `useAuthContext` : Access our Auth Context to retreive and monitor user authentication state from firebase and access dispatch actions to update user state
- `useLogin` : Login a user with email and password, invoke login function from firebase and persit to local state
- `useLogout` : Invoke logout function from firebase and persit to local state
- `useSignup` : Create a user with email and password, invoke signup function from firebase and persit to local state
- `useSocialAuth` : Create or Login a user through using Social Authentication and persit status to local state
