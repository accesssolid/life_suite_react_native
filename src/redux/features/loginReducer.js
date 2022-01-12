
import { createSlice } from '@reduxjs/toolkit'
import {clearBankModalData} from './bankModel'
import {clearListChatUsers} from './chatUser'
import {clearNotificationData} from './notification'
import {clearMyJobs} from './provider'
import {clearCleanData} from './services'
const authenticateSlice = createSlice({
    name: "authenticate",
    initialState: {
        authenticate: false,
        user: {},
        friends: {},
        name: '',
        token: "",
        modal: true,
        initial: 'SelectOption',
        user_role: 1,
        access_token: null,
        services: []
    },
    reducers: {
        loadauthentication: (state, action) => {
            state.user = action.payload
            state.authenticate = true
        },
        friendauthentication: (state, action) => {
            state.friends = action.payload
            state.authenticate = true
        },
        fcmToken: (state, action) => {
            state.token = action.payload
        },
        logoutState: (state, action) => {
            state.authenticate = false
            state.friends = {}
        },
        modalState: (state, action) => {
            state.modal = action.payload
        },
        loadInitial: (state, action) => {
            state.initial = action.payload
        },
        setUserRole: (state, action) => {
            state.user_role = action.payload.data
        },
        setAuthToken: (state, action) => {
            state.access_token = action.payload.data
        },
        setServices: (state, action) => {
            state.services = action.payload.data
        },
    }
})

export const { logoutState, loadauthentication, friendauthentication, fcmToken, modalState, loadInitial, setUserRole, setAuthToken, setServices } = authenticateSlice.actions

export const loginReducer = (data) => {
    return async (dispatch) => {
        try {
            dispatch(loadauthentication(data))
        } catch (err) {

        }
    }
}
export const tokenReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(fcmToken(data))
        } catch (err) {

        }
    }
}
export const loginFriendReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(friendauthentication(data))
        } catch (err) {

        }
    }
}
export const modalReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(modalState(data))
        } catch (err) {

        }
    }
}
export const InitialReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(loadInitial(data))
        } catch (err) {

        }
    }
}

export const logoutAll = () => {
    return async (dispatch) => {
        dispatch(logoutState())
        dispatch(clearCleanData())
        dispatch(clearListChatUsers())
        dispatch(clearMyJobs())
        dispatch(clearNotificationData())
        dispatch(clearBankModalData())
        try {

        } catch (err) {
            console.log(err)
        }
    }
}
export default authenticateSlice.reducer