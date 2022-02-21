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

const CnfSch = (props) => {
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
                            <Text style={{ alignSelf: 'center', fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>Confirmed & Scheduled</Text>
                            <Card style={styles.alexiContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Image
                                            style={{ height: 70, width: 70, resizeMode: 'contain' }}
                                            source={require("../../../assets/man.png")}
                                        />

                                    </View>
                                    <View style={{ alignSelf: 'center', right: 30 }}>

                                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Alexi</Text>
                                        <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Australia</Text>
                                    </View>
                                    <View style={{}}>

                                    </View>
                                    <View style={{ alignSelf: "center" }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 20, color: LS_COLORS.global.green, alignSelf: 'flex-end' }}>2.5hrs</Text>
                                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginLeft: 20, alignSelf: 'flex-end' }}>$15</Text>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: "black", marginLeft: 20, alignSelf: 'flex-end' }}>2/2/2021</Text>
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
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 3</Text>
                                    <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$50</Text>
                                </View>
                            </Card>
                            <Card style={styles.alexiContainer}>
                                <Image
                                    style={{ height: 26, width: 26, resizeMode: 'contain', alignSelf: 'flex-end' }}
                                    source={require("../../../assets/cross.png")}
                                />
                                <View style={{ width: "95%", marginTop: 20, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium }}>Invoice:</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Tas12asdf54adk 1</Text>
                                </View>
                                <View style={{ width: "95%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Service:</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Mechanic</Text>
                                </View>
                                <View style={{ width: "95%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Name:</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Alexi</Text>
                                </View>
                                <View style={{ width: "95%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Date:</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>2/2/2021</Text>
                                </View>
                                <View style={{ width: "95%", marginTop: 10, alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Start Time:</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>10.00am</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.save}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        props.navigation.navigate("HomeScreen")
                                    }}
                                >
                                    <Text style={styles.saveText}>Next</Text>
                                </TouchableOpacity>
                                <View style={{ height: 20 }}></View>
                            </Card>

                            <View style={{ height: 30 }}></View>
                        </Content>
                    </Container>
                </View>
            </SafeAreaView>
        </>
    )
}

export default CnfSch;

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
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 18,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
        marginTop: 20
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
        padding: 10,
    },
    inputStyle: {
        padding: 10
    },

})





