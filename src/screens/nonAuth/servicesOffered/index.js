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
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(false);
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(true);
    const [category, setCategory] = useState("Category")

    const [oil, setOil] = useState("")
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
                    <Text style={styles.mechanic}>MECHANIC</Text>
                </View>
            </ImageBackground>
            <View style={styles.container}>
                <Container style={{ paddingTop: Platform.OS === 'ios' ? "49%" : "67%" }}>
                    <Content>
                        <Text style={styles.service}>SERVICES</Text>
                        <View style={styles.price}>
                            <Text style={styles.priceTime}>Price</Text>
                            <Text style={styles.priceTime}>Time</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked}
                                onPress={() => {
                                    setChecked(!checked)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Oil</Text>
                            <View style={{ flex: 1, justifyContent:'flex-end', flexDirection:'row' }}>
                                <View style={styles.fromContainer}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        color="black"
                                        value={oil}
                                        onChangeText={(text) => { setOil(text) }}
                                    />
                                </View>
                                <View style={styles.fromContainer}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        color="black"
                                        value={oil}
                                        placeholder="HH:MM"
                                        onChangeText={(text) => { setOil(text) }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '30%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked1}
                                onPress={() => {
                                    setChecked1(!checked1)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Wiper Blades</Text>
                            <View style={styles.fromContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color="black"
                                    value={oil}
                                    onChangeText={(text) => { setOil(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '30%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked2}
                                onPress={() => {
                                    setChecked2(!checked2)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Replace Headlights</Text>
                            <View style={styles.fromContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color="black"
                                    value={oil}
                                    onChangeText={(text) => { setOil(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '30%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked3}
                                onPress={() => {
                                    setChecked3(!checked3)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />

                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Replace Taillights</Text>
                            <View style={styles.fromContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color="black"
                                    value={oil}
                                    onChangeText={(text) => { setOil(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '26%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked4}
                                onPress={() => {
                                    setChecked4(!checked4)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Replace Cabin Filter</Text>
                            <View style={styles.fromContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color="black"
                                    value={oil}
                                    onChangeText={(text) => { setOil(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked5}
                                onPress={() => {
                                    setChecked5(!checked5)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />

                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>Other</Text>
                            <View style={styles.fromContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color="black"
                                    value={oil}
                                    onChangeText={(text) => { setOil(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ height: 30 }}></View>
                    </Content>
                </Container>
            </View>
        </SafeAreaView >
    )
}

export default ServicesProvided;

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
        height: '55%',
        zIndex: 10,
    },
    mechanic: {
        fontSize: 29,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    price: {
        width: '100%',
        alignSelf: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    priceTime: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        marginRight: 49
    },
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
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
    fromContainer: {
        height: 32,
        width: 68,
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: '#ECECEC',
        marginRight: 20
    },
    inputStyle: {
    },
})





