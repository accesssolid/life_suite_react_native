import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
    },
})

// store.subscribe(() => {
//     console.log("Redux Store State ===>>>>> ", store.getState())
// })

export default store