import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Modal, TouchableOpacity, Pressable } from 'react-native'
// import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { updateBlockModal } from '../redux/features/blockModel';
import { CommonActions, useNavigation } from '@react-navigation/native';

const BlockMessageModal = () => {
    const dispatch = useDispatch()
    const isVisible = useSelector(state => state.blockModel?.open)
    const user = useSelector(state => state.authenticate.user)


    return (
        <Modal
            onBackButtonPress={() => dispatch(updateBlockModal(false))}
            onBackdropPress={() => dispatch(updateBlockModal(false))}
            hasBackdrop={true}
            visible={isVisible}
            transparent={true}
        // animationType="slide"
        >
            <View style={{ flex: 1, backgroundColor: "#0005", justifyContent: "center" }}>
                <View style={styles.container}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.title}></Text>
                    <Image source={require('../assets/splash/logo.png')} resizeMode="contain" style={{ height: 100, width: 200, alignSelf: "center" }} />
                    <Text maxFontSizeMultiplier={1.4} style={{ color: "black", fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16, textAlign: "center" }}>{user?.block_message}</Text>
                    <TouchableOpacity onPress={() => {
                        dispatch(updateBlockModal(false))
                    }} style={{ backgroundColor: LS_COLORS.global.green, padding: 10, width: "40%", alignSelf: "center", borderRadius: 5, margin: 10 }} >
                        <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white", textAlign: "center" }}>Ok</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        dispatch(updateBlockModal(false))
                    }} style={{ position: 'absolute', top: '3%', right: '3%' }}>
                        <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default BlockMessageModal;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '95%',
        alignSelf: 'center',
        padding: '4%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        paddingVertical: 10,
        overflow: 'hidden',
    },
    title: {
        fontFamily: LS_FONTS.PoppinsBold,
        fontSize: 16,
        letterSpacing: 0.32,
        color: LS_COLORS.global.darkBlack,
        textTransform: 'uppercase',
        textAlign: "center"
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