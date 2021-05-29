import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/authentication'

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
    },
})

// store.subscribe(() => {
//     console.log("Redux Store State ===>>>>> ", store.getState())
// })

export default store