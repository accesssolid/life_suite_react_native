import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import moment from "moment";

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content, Row } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';

const MechanicLocation = (props) => {
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(false);
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(false);
    const [checked7, setChecked7] = useState(false);
    const [checked8, setChecked8] = useState(false);
    const [category,setCategory] = useState()

    const category_array = [
        {
            label: 'Yeshivish',
            value: 'Yeshivish'
        },
        {
            label: 'Modern Yeshivish',
            value: 'Modern Yeshivish'
        },
        {
            label: 'Chassidish',
            value: 'Chassidish'
        },
        {
            label: 'Heimish',
            value: 'Heimish'
        },
        {
            label: 'Chabad',
            value: 'Chabad'
        },
        {
            label: 'Modern Orthodox Machmir',
            value: 'Modern Orthodox Machmir'
        },
        {
            label: 'Modern Orthodox',
            value: 'Modern Orthodox'
        },
        {
            label: 'Toradig',
            value: 'Toradig'
        },
    ]
    const [from, setFrom] = useState("")
    // const dates = props.route.params.date
    const[date,setDate] = useState("")

    const renderView = () => {
        return (
            <Container style={{ marginTop: Platform.OS === 'ios' ? "49%" : "67%" }}>
                <Content>
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
                                style={{alignSelf: "center", marginRight: 10 }}
                                activeOpacity={0.7}
                            >
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24,marginTop:20 }}>To</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={from}
                                onChangeText={(text) => {setFrom(text)}}
                            />
                            <TouchableOpacity
                                style={{alignSelf: "center",marginRight:10}}
                                activeOpacity={0.7}
                            >
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24,marginTop:20 }}>Add Date</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={date}
                                onChangeText={(text) => {setDate(text)}}
                            />
                            <TouchableOpacity
                            onPress = {() => {
                                props.navigation.navigate("Calendar")
                            }}
                                style={{alignSelf: "center",marginRight:10}}
                                activeOpacity={0.7}
                            >
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/datePicker.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: "5%"}}>
                        
                            <View style={{ flexDirection: 'column', width: "32%" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Start Time</Text>
                                <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10, alignSelf: "center"}}>
                                    <DropDown
                                        item={category_array}
                                        defaultValue={category}
                                        width={widthPercentageToDP(30)}
                                        onChangeItem={(t) => setCategory(t.value)}
                                        placeholder="Car"
                                    />
                                </Row>
                            </View>
                            <View style={{ flexDirection: 'column', width: "40%" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>End Time</Text>
                                <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10, alignSelf: "center",marginRight:30}}>
                                    <DropDown
                                        item={category_array}
                                        defaultValue={category}
                                        width={widthPercentageToDP(30)}
                                        onChangeItem={(t) => setCategory(t.value)}
                                        placeholder="Car"
                                    />
                                </Row>
                            </View>
                            </View>
                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => {
                        }}
                    >
                        <Text style={styles.saveText}>Submit</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30 }}></View>
                </Content>
            </Container>
        )
    }

    return (

        <SafeAreaView style={styles.safeArea}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ImageBackground
                source={require("../../../assets/handyMan.png")}
                style={styles.image}
            >
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
            </ImageBackground>
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ?
                        renderView()
                        :
                        renderView()
                }

            </View>

        </SafeAreaView >
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
        position: 'absolute',
        width: '100%',
        height: '55%',
        zIndex: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
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
        height: 40,
        width: "88%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderWidth: 1,
        padding:10
    },
    inputStyle: {
        padding:10
    },


})





