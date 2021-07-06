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

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Card, Container, Content, Row, } from 'native-base'

const Mechanics = (props) => {
    const [checked, setChecked] = useState(false)
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const [checked4, setChecked4] = useState(false)
    const [checked5, setChecked5] = useState(false)
    const [checked6, setChecked6] = useState(false)
    const [checked7, setChecked7] = useState(false)

    return (
        <>
            <ImageBackground
                source={require("../../../assets/handyMan.png")}
                style={styles.image}
            >
                <View style={{ height: "60%", justifyContent: 'flex-end' }}>
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
                </View>
                <View style={{ justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>MECHANIC</Text>
                </View>
            </ImageBackground>
            <View style={styles.container}>
                <Container style={{ marginTop: Platform.OS === 'ios' ? "42%" : "45%" }}>
                    <Content>
                        <View style={{ height: 40, width: '90%',left:10,justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Image
                                style={{ alignSelf:'center',height: 30, width: 30, resizeMode: 'contain' }}
                                source={require("../../../assets/filter.png")}
                            />
                            <View style = {styles.upper} >
                                <Text style = {styles.upperText}>Price</Text>
                            </View>
                            <View style = {styles.upper} >
                                <Text style = {styles.upperText}>Time</Text>
                            </View>
                            <View style = {styles.upper} >
                                <Text style = {styles.upperText}>Rating</Text>
                            </View>
                        </View>
                        <Card style={styles.alexiContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Image
                                        style={{ height: 100, width: 100, resizeMode: 'contain' }}
                                        source={require("../../../assets/man.png")}
                                    />

                                </View>
                                <View style={{ top: "5%", right: 30 }}>

                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Alexi</Text>
                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Australia</Text>
                                </View>
                                <View style={{}}>

                                </View>
                                <View style={{}}>
                                    <CheckBox
                                        checked={checked}
                                        onPress={() => {
                                            setChecked(!checked)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23, alignSelf: "flex-end" }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23, alignSelf: "flex-end" }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginLeft: 20 }}>$65</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>I am a Professional Mechanic having 4y exp.</Text>
                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}>Rating * * * * *</Text>
                            <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Oil Change   </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>(Service Charge)</Text>
                                </Text>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$10</Text>
                                    <CheckBox
                                        checked={checked1}
                                        onPress={() => {
                                            setChecked1(!checked1)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View>
                                    <Text style={{ marginLeft: 20 }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 100, backgroundColor: "#CACACA", justifyContent: "center", alignItems: "center" }}></View>

                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium, }}>5W - 20           </Text>
                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsRegular, }}>(Product)</Text>
                                    </Text>
                                </View>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$15</Text>
                                    <CheckBox
                                        checked={checked2}
                                        onPress={() => {
                                            setChecked2(!checked2)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 3</Text>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$50</Text>
                                    <CheckBox
                                        checked={checked3}
                                        onPress={() => {
                                            setChecked3(!checked3)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Total Time</Text>
                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>2.5 hrs</Text>
                            </View>
                        </Card>
                        <Card style={{ ...styles.alexiContainer, marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Image
                                        style={{ height: 100, width: 100, resizeMode: 'contain' }}
                                        source={require("../../../assets/amanda.png")}
                                    />

                                </View>
                                <View style={{ top: "5%", right: 20 }}>

                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Amanda</Text>
                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>San Fransisco</Text>
                                </View>
                                <View style={{}}>

                                </View>
                                <View style={{}}>
                                    <CheckBox
                                        checked={checked4}
                                        onPress={() => {
                                            setChecked4(!checked4)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23, alignSelf: "flex-end" }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23, alignSelf: "flex-end" }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginLeft: 20 }}>$20</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>I am a Professional Mechanic having 6y exp.</Text>
                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}>Rating * * *</Text>
                            <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Oil Change   </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>(Service Charge)</Text>
                                </Text>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$10</Text>
                                    <CheckBox
                                        checked={checked1}
                                        onPress={() => {
                                            setChecked1(!checked1)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View>
                                    <Text style={{ marginLeft: 20 }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 100, backgroundColor: "#CACACA", justifyContent: "center", alignItems: "center" }}></View>

                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium, }}>5W - 20           </Text>
                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsRegular, }}>(Product)</Text>
                                    </Text>
                                </View>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$15</Text>
                                    <CheckBox
                                        checked={checked2}
                                        onPress={() => {
                                            setChecked2(!checked2)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 3</Text>
                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$50</Text>
                                    <CheckBox
                                        checked={checked3}
                                        onPress={() => {
                                            setChecked3(!checked3)
                                        }}
                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Time</Text>
                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>1.5 hrs</Text>
                            </View>
                        </Card>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                props.navigation.navigate("Client")
                            }}
                        >
                            <Text style={styles.saveText}>Request</Text>
                        </TouchableOpacity>
                        <View style={{ height: 30 }}></View>
                    </Content>
                </Container>
            </View>
        </>
    )
}

export default Mechanics;

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
        resizeMode: 'contain',
        width: '101%',
        height: 160,
        zIndex: 10,
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
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
        marginTop:10
    },
    upper: {
        justifyContent: "center",
        alignItems: 'center',
        height: 25,
        width: 75,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf:'center'
    },
    upperText:{
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    }

})





