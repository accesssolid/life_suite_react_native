import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'
import ServiceReducer from './features/services'
import ProviderReducer from './features/provider'
import TotalReducer from "./features/total"

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
        services: ServiceReducer,
        provider: ProviderReducer,
        total : TotalReducer
    },
})

store.subscribe(() => {
    // console.log("Store ==>>> ", store.getState())
})

export default store