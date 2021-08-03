import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { Container, Content } from "native-base";

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import BankModal from '../../../components/bankModal';

const ServiceProfile = (props) => {
    const dispatch = useDispatch()
    const [lastName, setLastName] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [no, setNo] = useState("")
    const [pass, setPass] = useState("")
    const [add, setAdd] = useState(true)
    const [add1, setAdd1] = useState("")
    const [add2, setAdd2] = useState("")
    const [noti, setNoti] = useState("")
    const [bank, setBank] = useState("")
    const [open, setOpen] = useState(false)
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <BankModal
                pressHandler={() => {
                    setOpen(!open);
                }}
                visible={open}
                action1={() => {
                    setOpen(!open);
                }}
            />
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.pop()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <TouchableOpacity
                style={{ alignSelf: 'center', position: 'absolute', zIndex: 100, top: Platform.OS === 'ios' ? "6%" : "1%" }}
                activeOpacity={0.7}
                onPress={() => {
                }}>
                <Image
                    style={{ height: 116, width: 116, resizeMode: 'contain' }}
                    source={require("../../../assets/man.png")}
                />
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={styles.container}>

                <View style={{ top: '6%' }}>

                    <View style={{}}>
                        <Text style={styles.text}>MY INFORMATION</Text>
                        <Text style={styles.text1}>Alexi</Text>
                        <Text style={styles.text2}>Profile ID : 54692</Text>
                    </View>

                    <View style={styles.personalContainer}>
                        <Text style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>PERSONAL INFORMATION</Text>
                        <CustomInput
                            text="Last Name"
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text)
                            }}
                        />
                        <CustomInput
                            text="Preffered Name"
                            value={name}
                            onChangeText={(text) => {
                                setName(text)
                            }}
                        />
                        <CustomInput
                            text="Email Address"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                            }}
                        />
                        <CustomInput
                            text="Phone Number"
                            value={no}
                            onChangeText={(text) => {
                                setNo(text)
                            }}
                        />
                        <CustomInput
                            text="Password"
                            value={pass}
                            onChangeText={(text) => {
                                setPass(text)
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setAdd(!add)
                            }}
                        >
                            {add ? <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                <Image
                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                    source={require("../../../assets/plus.png")}
                                />
                                <Text style={{ ...styles.text2, marginLeft: 10, }}>PERMANENT ADDRESS</Text>
                            </View> :
                                <>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                        <Image
                                            style={{ height: 24, width: 24, resizeMode: "contain" }}
                                            source={require("../../../assets/minus.png")}
                                        />
                                        <Text style={{ ...styles.text2, marginLeft: 10, }}>PERMANENT ADDRESS</Text>
                                    </View>
                                    <View style={{}}>
                                        <CustomInput
                                            text="ADDRESS LINE 1"
                                            value={add1}
                                            onChangeText={(text) => {
                                                setAdd1(text)
                                            }}
                                        />
                                        <CustomInput
                                            text="ADDRESS LINE 2"
                                            value={add2}
                                            onChangeText={(text) => {
                                                setAdd2(text)
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={styles.save}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setAdd(!add)
                                            }}
                                        >
                                            <Text style={styles.saveText}>
                                                Save
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </TouchableOpacity>

                        <View style={{}}>
                            <CustomInput
                                text="Bank Information"
                                value={bank}
                                onChangeText={(text) => {
                                    setBank(text)
                                }}
                                image
                                imageUrl={require("../../../assets/user.png")}
                                action={() => {
                                    setOpen(!open)
                                }}
                            />
                            <CustomInput
                                text="Type of Notification"
                                value={noti}
                                onChangeText={(text) => {
                                    setNoti(text)
                                }}
                            />
                        </View>
                        <View style={{ height: 40 }}></View>
                    </View>

                    <View style={{ height: 50 }}></View>

                </View>
                <View style={{ height: 50 }}></View>
                <TouchableOpacity
                    style={styles.save}
                    activeOpacity={0.7}
                    onPress={() => {
                    }}
                >
                    <Text style={styles.saveText}>
                        Save
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 20 }}></View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ServiceProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    text: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        marginTop: 16,
        alignSelf: 'center'
    },
    text1: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        marginTop: 16,
        alignSelf: 'center',
        color: LS_COLORS.global.green
    },
    text2: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        alignSelf: 'center',
        color: '#5A5A5A'
    },
    personalContainer: {
        maxHeight: '100%',
        width: "90%",
        top: "5%",
        elevation: 200,
        shadowColor: '#00000029',
        backgroundColor: 'white',
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        alignSelf: 'center',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 40,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
