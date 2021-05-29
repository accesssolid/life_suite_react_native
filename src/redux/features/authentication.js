
import { createSlice } from '@reduxjs/toolkit'

/* Toaster */
import Toast from 'react-native-simple-toast';

const authenticateSlice = createSlice({
    name: "authenticate",
    initialState: {
        isAuthorized: false,
        auth_Token: null,
        loading: false,
    },
    reducers: {
        setAuthStatus: (state, action) => {
            state.isAuthorized = action.payload.data
        },
        setAuthToken: (state, action) => {
            state.auth_Token = action.payload.data
        },
        setLoading: (state, action) => {
            state.loading = action.payload.data
        },
    }
})

export const { setAuthStatus, setAuthToken, setLoading } = authenticateSlice.actions

// export const login = (data) => {
//     let config = {
//         method: 'POST',
//         endpoint: "users/login",
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         data: { ...data }
//     }

//     return async function (dispatch, getState) {
//         return new Promise(function (resolve, reject) {
//             dispatch(setLoading({ data: true }))
//             api(config)
//                 .then(async (res) => {
//                     if (res.status == true) {
//                         await storeJsonData('auth_token', res.data.token)
//                         dispatch(setAuthStatus({ data: true }))
//                         dispatch(setAuthToken({ data: res.data.token }))
//                         dispatch(setLoading({ data: false }))
//                         await dispatch(getPilotDetails())
//                         resolve({ status: res.status, data: res })
//                     } else {
//                         dispatch(setLoading({ data: false }))
//                         resolve({ status: res.status, message: res.message })
//                     }
//                 })
//                 .catch((err) => {
//                     dispatch(setLoading({ data: false }))
//                     Toast.showWithGravity('Please try again', Toast.SHORT, Toast.BOTTOM);
//                     reject({ status: false, message: err })
//                 })
//         })
//     };
// }

export default authenticateSlice.reducer