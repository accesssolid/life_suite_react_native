import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'
import ServiceReducer from './features/services'
import ProviderReducer from './features/provider'

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
        services: ServiceReducer,
        provider: ProviderReducer,
    },
})

export default store