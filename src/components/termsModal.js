import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";

const TermsModal = (props) => {
    return (
        <Modal
            onBackButtonPress={() => props.setVisible(false)}
            onBackdropPress={() => props.setVisible(false)}
            hasBackdrop={true}
            isVisible={props.isVisible}>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => props.setVisible(false)} style={{ height: 25, aspectRatio: 1, position: 'absolute', top: '3%', right: '3%' }}>
                    <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
                <Text style={styles.title}>TERMS & CONDITIONS</Text>
                <Text style={styles.desc}>{"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos etLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos etc."}</Text>
            </View>
        </Modal>
    )
}

export default TermsModal;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        // height: '50%',
        aspectRatio: 1,
        width: '95%',
        alignSelf: 'center',
        alignItems: 'center',
        padding: '3%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        justifyContent: 'center',
        paddingVertical: 10,
        overflow: 'hidden'
    },
    title: {
        fontFamily: LS_FONTS.PoppinsBold,
        fontSize: 16,
        letterSpacing: 0.32,
        color: LS_COLORS.global.darkBlack,
        textTransform: 'uppercase'
    },
    desc: {
        marginTop: 25,
        fontFamily: LS_FONTS.PoppinsRegular,
        fontSize: 12,
        letterSpacing: 0.24,
        color: LS_COLORS.global.textInputText,
        textAlign: 'left'
    }
})