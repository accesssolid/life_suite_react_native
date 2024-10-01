import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import LS_FONTS from '../constants/fonts';



export default function CustomDeleteModal({
    isvisible,
    modalIcon,
    nameTitle,
    Title,
    onPresYes,
    onPresCancel,
    YesTitle,
    CancelTitle
}) {
    const style = useStyles();

    return (
        <Modal transparent={true} visible={isvisible}>
            <View
                style={style.mainview}
            >
                <View style={style.mainview}>
                    <View
                        style={style.modalContainer}>
                        {/* <FastImage
                            resizeMode="contain"
                            source={modalIcon}
                            style={style.iamgeView}
                        /> */}
                        <Text
                            maxFontSizeMultiplier={1.8}
                            style={style.logoutTitle}>{nameTitle}</Text>
                        <View style={{ width: Platform.OS == 'ios' ? '70%' : "85%" }}>
                            <Text
                                maxFontSizeMultiplier={1.8}
                                style={style.AreYouSureTitle}>{Title}</Text>
                        </View>

                        <View style={style.btnContainer}>
                            <TouchableOpacity
                                onPress={onPresYes}
                                style={[style.yesBtn, { backgroundColor: "green" }]}
                            >
                                <Text
                                    maxFontSizeMultiplier={1.6}
                                    style={style.btnTitle}>{YesTitle}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onPresCancel}
                                style={[style.yesBtn, { backgroundColor: "red" }]}
                            >
                                <Text
                                    maxFontSizeMultiplier={1.6}
                                    style={style.btnTitle}>{CancelTitle}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    )
}
const useStyles = (colors) =>
    StyleSheet.create({
        mainview: {
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
            width: "94%",
            alignSelf: "center",
            alignItems: "center",
            minHeight: 200,
            borderRadius: 10,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            paddingVertical: 30
        },
        iamgeView: {
            height: 80,
            width: 80,

        },
        logoutTitle: {
            textAlign: "center",
            fontFamily: LS_FONTS.PoppinsSemiBold,
            fontSize: 22,
            color: "black",
            marginTop: 10,
        },
        AreYouSureTitle: {
            fontSize: 16,
            fontFamily: LS_FONTS.PoppinsRegular,
            color: "black",
            marginTop: 5,
            textAlign: "center",

        },
        btnContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 25,
            width: "90%",
            alignSelf: 'center',
        },
        yesBtn: {
            height: 50,
            width: "45%",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
        },
        btnTitle: {
            fontFamily: LS_FONTS.PoppinsMedium,
            fontSize: 15,
            color: "white",
        },
    })