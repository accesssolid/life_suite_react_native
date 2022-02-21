import Toast from 'react-native-simple-toast';
import { StyleSheet } from 'react-native'
import LS_COLORS from '../constants/colors';

export const showToast = (text) => {
    return Toast.showWithGravity(text, Toast.SHORT, Toast.BOTTOM);
}

export const globalStyles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: LS_COLORS.global.green
    },
})

export const getCardImage = (type) => {
    console.log("type  ===>> ", type)
    switch (type) {
        case "visa":
            return require("../assets/Images/visa.png")
        case "mastercard":
            return require("../assets/Images/master.png")
        case "american-express":
            return require("../assets/Images/american.png")
        case "discover":
            return require("../assets/Images/discover.png")
        case "jcb":
            return require("../assets/Images/jcb.png")
        case "unionpay":
            return require("../assets/Images/unionpay.png")
        case "diners_club":
            return require("../assets/Images/dinner_club.png")
        case "mir":
            return require("../assets/Images/mir.png")
        case "elo":
            return require("../assets/Images/elo.png")
        case "hiper":
            return require("../assets/Images/hiper.png")
        case "hipercards":
            return require("../assets/Images/hipercard.png")
        case "maestro":
            return require("../assets/Images/maestro.png")
        default:
            return require("../assets/Images/invalid.png")
    }
}