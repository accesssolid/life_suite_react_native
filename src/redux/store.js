import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
    },
})

export default store