import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'
import ServiceReducer from './features/services'
import ProviderReducer from './features/provider'
import TotalReducer from "./features/total"
import ChatUsersReducer from './features/chatUser'
const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
        services: ServiceReducer,
        provider: ProviderReducer,
        total : TotalReducer,
        chat_users:ChatUsersReducer
    },
})

store.subscribe(() => {
    console.log("Store ==>>> ", store.getState())
})

export default store