import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import moment from "moment";
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content, Row } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';

const MechanicLocation = (props) => {
    const [category, setCategory] = useState('1:00')

    const category_array = ['1:00', '02:00', '03:00', '4:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00']
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState("asdasd")

    const renderView = () => {
        return (
            <View style={{ flex:1, marginTop: 26 }}>
                <ScrollView style={{ flex:1 }} keyboardShouldPersistTaps='handled'>
                    <Image
                        style={{ height: 140, alignSelf: 'center', width: "90%", marginTop: 10 }}
                        source={require("../../../assets/map.png")}
                    />
                    <View style={{ height: 45, width: "90%", marginTop: 20, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.green }}>
                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Other Location</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24 }}>From</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={from}
                                onChangeText={(text) => { setFrom(text) }}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: "center", marginRight: 10 }}
                                activeOpacity={0.7}>
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
                                value={to}
                                onChangeText={(text) => { setTo(text) }}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: "center", marginRight: 10 }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>Add Date</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={date}
                                onChangeText={(text) => { setDate(text) }}
                                editable={false}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.navigate("Calendar", { setDate: setDate.bind(this) })
                                }}
                                style={{ alignSelf: "center", marginRight: 10 }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/datePicker.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: "5%" }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Start Time</Text>
                            <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                <DropDown
                                    item={category_array}
                                    value={category}
                                    width={widthPercentageToDP(30)}
                                    onChangeItem={(t) => setCategory(t)}
                                    placeholder="Car"
                                    dropdownStyle={{ width: '30%', alignItems: 'center' }}
                                />
                            </Row>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>End Time</Text>
                            <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10 }}>
                                <DropDown
                                    item={category_array}
                                    value={category}
                                    width={widthPercentageToDP(30)}
                                    onChangeItem={(t) => setCategory(t)}
                                    placeholder="Car"
                                    dropdownStyle={{ width: '30%', alignItems: 'center' }}
                                />
                            </Row>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => {
                            props.navigation.navigate("Mechanics")
                        }}>
                        <Text style={styles.saveText}>Submit</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30 }}></View>
                </ScrollView>
            </View>
        )
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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
                                    props.navigation.pop()
                                }}
                                imageUrl1={require("../../../assets/homeWhite.png")}
                                action1={() => {
                                    props.navigation.navigate("HomeScreen")
                                }}
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
                    {renderView()}
                </View>
            </SafeAreaView >
        </>
    )
}

export default MechanicLocation;

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
        width: 174,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    item: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    checkBoxTxt: {
        marginLeft: 20,
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: widthPercentageToDP(28),
        paddingHorizontal: 15,
        borderRadius: 30,
        paddingVertical: 5,
        marginHorizontal: 5
    },
    fromContainer: {
        height: 50,
        width: "88%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft: '5%'
    },
    inputStyle: {
        height: '100%',
        width: '90%'
    },


})





