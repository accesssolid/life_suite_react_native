import React, { useState, Fragment } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, TouchableOpacity, StatusBar } from 'react-native'
import { CheckBox } from "react-native-elements"
/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */;
import Header from '../../../components/header';

const MechanicServices = (props) => {
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(true)

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                imageUrl={require("../../../assets/backWhite.png")}
                action={() => {
                    props.navigation.pop()
                }}
                imageUrl1={require("../../../assets/homeWhite.png")}
                action1={() => {
                    props.navigation.navigate("AddJob")
                }}
            />
            <ImageBackground
                source={require("../../../assets/handyMan.png")}
                style={styles.image}
            >
                <View style={{ justifyContent: 'center', alignItems: "center", height: "55%" }}>
                    <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>MECHANIC</Text>
                </View>
            </ImageBackground>
            <View style={styles.container}>
                <View style={{ top: "30%" }}>
                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>OIL</Text>
                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>WIPER BLADES</Text>
                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>REPLACE HEADLIGHTS</Text>
                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>SERVICES</Text>
                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>SERVICES</Text>

                    <Text style={{ fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: "center" }}>SERVICES</Text>
                    {/* <CheckBox
                        checked={checked}
                        checkedIcon={<Image style={{ height: 20, width: 20 }} source={require('../../../assets/room.png')} />}
                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} source={require('../../../assets/man.png')} />}
                        onPress={() => {
                            setChecked(!checked)
                        }}
                    /> */}
                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => {
                        }}
                    >
                        <Text style={styles.saveText}>Confirm</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30 }}></View>
                </View>

            </View>

        </SafeAreaView>
    )
}

export default MechanicServices;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,

    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    image: {
        position: 'absolute',
        width: '101%',
        height: '55%',
        zIndex: 200,
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }

})





