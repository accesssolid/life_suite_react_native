import Toast from 'react-native-simple-toast';

export const showToast = (text) => {
    return Toast.showWithGravity(text, Toast.SHORT, Toast.BOTTOM);
}