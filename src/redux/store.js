import { configureStore } from '@reduxjs/toolkit'
import AuthenticateReducer from './features/loginReducer'
import ServiceReducer from './features/services'
import ProviderReducer from './features/provider'
import TotalReducer from "./features/total"
import ChatUsersReducer from './features/chatUser'
import BankModelReducer from './features/bankModel'
import NotificationReducer from './features/notification'
import switchTo from './features/switchTo'
import faq from './features/faq'
import signupModal from './features/signupModal'
import blockModel from './features/blockModel'
import dot from './features/showDot'
import variant from './features/variantData'
import favorites from './features/favorites'
import questionaireModel from './features/questionaire.model'
import currentlocation from './features/currentlocation'

const store = configureStore({
    reducer: {
        authenticate: AuthenticateReducer,
        services: ServiceReducer,
        provider: ProviderReducer,
        total: TotalReducer,
        chat_users: ChatUsersReducer,
        bank_model: BankModelReducer,
        notification: NotificationReducer,
        switchTo,
        faq,
        signupModal,
        blockModel,
        dot,
        variant,
        favorites,
        questionaireModel,
        currentlocation
    },
})

store.subscribe(() => {
    // console.log("Store ==>>> ", store.getState())
})

export default store