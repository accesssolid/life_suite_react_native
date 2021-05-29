import Toast from 'react-native-simple-toast';
import { StyleSheet } from 'react-native'
import LS_COLORS from '../constants/colors';

export const showToast = (text) => {
    return Toast.showWithGravity(text, Toast.SHORT, Toast.BOTTOM);
}

export const globalStyles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan
    },
})