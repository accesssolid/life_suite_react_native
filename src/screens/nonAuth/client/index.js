import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Card, Container, Content, Row, } from 'native-base'
import { fonts } from 'react-native-elements/dist/config';

const Client = (props) => {
    const [from, setFrom] = useState("")
    const [date, setDate] = useState("")
    return (
        <>
            <StatusBar 
            // translucent 
            // backgroundColor={"transparent"} 
            backgroundColor={LS_COLORS.global.green}
             barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={require("../../../assets/handyMan.png")}
                    style={styles.image}>
                    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                        <View style={{ height: "22%", justifyContent: 'flex-end' }}>
                            <Header
                                imageUrl={require("../../../assets/backWhite.png")}
                                action={() => {
                                    props.navigation.goBack()
                                }}
                                imageUrl1={require("../../../assets/homeWhite.png")}
                                action1={() => {
                                    props.navigation.navigate("HomeScreen")
                                }}
                                // containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                            <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>MECHANIC</Text>
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    <Container style={{ marginTop: 26 }}>
                        <Content>
                            <Text style={{ alignSelf: 'center', fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>CLIENT</Text>
                            <Card style={styles.alexiContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Image
                                            style={{ height: 70, width: 70, resizeMode: 'contain' }}
                                            source={require("../../../assets/andrea1.png")}
                                        />

                                    </View>
                                    <View style={{ alignSelf: 'center', right: 30 }}>

                                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Sarah</Text>
                                        <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Australia</Text>
                                    </View>
                                    <View style={{}}>

                                    </View>
                                    <View style={{ alignSelf: "center" }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 20, color: 'black' }}>Total Tasks</Text>
                                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginLeft: 20 }}>$60/hr</Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>I am a Professional Mechanic having 4y exp.</Text>
                                <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}>Rating * * * * *</Text>
                                <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 1</Text>
                                    <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$10</Text>
                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 2</Text>
                                    <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$15</Text>
                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Time</Text>
                                    <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>2.5 hrs</Text>
                                </View>
                            </Card>
                            <Image
                                style={{ height: 140, alignSelf: 'center', width: "90%", marginTop: 10 }}
                                source={require("../../../assets/map.png")}
                            />
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, color: "black" }}>From</Text>
                                <View style={styles.fromContainer}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        color="black"
                                        value={from}
                                        onChangeText={(text) => { setFrom(text) }}
                                    />
                                    <TouchableOpacity
                                        style={{ alignSelf: "center", marginRight: 10 }}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                            source={require("../../../assets/location.png")}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>To</Text>
                                <View style={styles.fromContainer}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        color="black"
                                        value={from}
                                        onChangeText={(text) => { setFrom(text) }}
                                    />
                                    <TouchableOpacity
                                        style={{ alignSelf: "center", marginRight: 10 }}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                            source={require("../../../assets/location.png")}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: "85%", marginTop: 20, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>User Requested Time Frame</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>10:00 am - 02:00 pm</Text>
                                </View>
                                <View style={{ width: "85%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Available Start Time</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>11.00 am</Text>
                                </View>
                                <View style={{ width: "85%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Estimate Drive Time</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>1 Hour</Text>
                                </View>
                            </View>
                            <View style={{ width: '70%', alignSelf: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.save}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        props.navigation.navigate("CnfSch")
                                    }}
                                >
                                    <Text style={styles.saveText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.save1}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        props.navigation.navigate("DeclineConfirmation")
                                    }}
                                >
                                    <Text style={styles.saveText1}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 30 }}></View>
                        </Content>
                    </Container>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Client;

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
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    save1: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 6,
        borderColor: LS_COLORS.global.green,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText1: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
        marginTop: 5
    },
    fromContainer: {
        height: 40,
        width: "88%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderWidth: 1,
        padding: 10
    },
    inputStyle: {
        padding: 10
    },

})





