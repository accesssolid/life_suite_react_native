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
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';

const MechanicServices = (props) => {
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
    const [category, setCategory] = useState("Category")



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
                            props.navigation.navigate("AddJob")
                        }}
                    />
                </View>
                <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                    <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>MECHANIC</Text>
                </View>
            </ImageBackground>
            <View style={styles.container}>
                <Container style={{ marginTop: Platform.OS === 'ios' ? "49%" : "67%" }}>
                    <Content>
                        <View>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginLeft: 24 }}>Vechile Type</Text>
                            <Row style={{ width: widthPercentageToDP(85), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                <DropDown
                                    item={category_array}
                                    defaultValue={category}
                                    width={widthPercentageToDP(85)}
                                    onChangeItem={(t) => setCategory(t.value)}
                                    placeholder="Car"
                                />
                            </Row>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: "5%", marginLeft: "5%" }}>
                            <View style={{ flexDirection: 'column', width: "25%" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Make</Text>
                                <Row style={{ width: widthPercentageToDP(24), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                    <DropDown
                                        item={category_array}
                                        defaultValue={category}
                                        width={widthPercentageToDP(24)}
                                        onChangeItem={(t) => setCategory(t.value)}
                                        placeholder="Car"
                                    />
                                </Row>
                            </View>
                            <View style={{ flexDirection: 'column', width: "25%" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Model</Text>
                                <Row style={{ width: widthPercentageToDP(24), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                    <DropDown
                                        item={category_array}
                                        defaultValue={category}
                                        width={widthPercentageToDP(24)}
                                        onChangeItem={(t) => setCategory(t.value)}
                                        placeholder="Car"
                                    />
                                </Row>
                            </View>
                            <View style={{ flexDirection: 'column', width: "25%" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Year</Text>
                                <Row style={{ width: widthPercentageToDP(24), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                    <DropDown
                                        item={category_array}
                                        defaultValue={category}
                                        width={widthPercentageToDP(24)}
                                        onChangeItem={(t) => setCategory(t.value)}
                                        placeholder="Car"
                                    />
                                </Row>
                            </View>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: '5%', width: '50%', flexDirection: "row" }}>
                            <CheckBox
                                checked={checked}
                                onPress={() => {
                                    setChecked(!checked)
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text style={{ fontSize: 14, right: 10, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', marginLeft: '4%' }}>Oil Change</Text>
                        </View>
                        {checked == true ?
                            <>
                                <View style={{ marginLeft: "15%", width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked1}
                                        onPress={() => {
                                            setChecked1(!checked1)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>Standard Stock for vehicle</Text>
                                </View>
                                <View style={{ marginLeft: "15%", width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked2}
                                        onPress={() => {
                                            setChecked2(!checked2)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>Full Sunthetic</Text>
                                </View>
                                <View style={{ marginLeft: "15%", width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked3}
                                        onPress={() => {
                                            setChecked3(!checked3)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>5W-20</Text>
                                </View>
                                <View style={{ marginLeft: "15%", width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked4}
                                        onPress={() => {
                                            setChecked4(!checked4)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>Other</Text>

                                </View>
                                {checked4 == true ?
                                    <TextInput
                                        style={{ marginLeft: "20%", padding: 10, height: 40, width: "60%", alignSelf: 'center', borderWidth: 1, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 3 }}

                                        placeholderTextColor="black"
                                        color="black"
                                    /> : null}

                                <View style={{ marginLeft: "15%", width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked5}
                                        onPress={() => {
                                            setChecked5(!checked5)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>I have my own</Text>

                                </View>
                                {checked5 == true ?
                                    <TextInput
                                        style={{ marginLeft: "20%", height: 40, padding: 10, width: "60%", alignSelf: 'center', borderWidth: 1, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 3, color: 'black' }}

                                        placeholderTextColor="black"
                                        color="black"
                                    />
                                    : null}
                                <View style={{ marginLeft: 20, marginTop: '5%', width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked6}
                                        onPress={() => {
                                            setChecked6(!checked6)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 14, right: 10, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', marginLeft: '4%' }}>Replace Windshield</Text>
                                </View>
                                <View style={{ marginLeft: 20, marginTop: '5%', width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked7}
                                        onPress={() => {
                                            setChecked7(!checked7)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 14, right: 10, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', marginLeft: '4%' }}>Tire Rotation</Text>
                                </View>
                                <View style={{ marginLeft: 20, marginTop: '5%', width: '50%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={checked8}
                                        onPress={() => {
                                            setChecked8(!checked8)
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 14, right: 10, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', marginLeft: '4%' }}>Replace Headlights</Text>
                                </View>
                            </>
                            :
                            null}
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                props.navigation.navigate("MechanicLocation")
                            }}
                        >
                            <Text style={styles.saveText}>Next</Text>
                        </TouchableOpacity>
                        <View style={{ height: 30 }}></View>
                    </Content>
                </Container>

            </View>

        </SafeAreaView >
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
    }

})





