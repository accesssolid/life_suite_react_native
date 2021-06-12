import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

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
import CustomButton from "../../../components/customButton"

const Profile = (props) => {
    const dispatch = useDispatch()
    const [lastName, setLastName] = useState("")
    console.log(lastName)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [no, setNo] = useState("")
    const [add, setAdd] = useState(true)
    const [edit, setEdit] = useState(true)
    const [add1, setAdd1] = useState("")
    const [add2, setAdd2] = useState("")
    const [add3, setAdd3] = useState("")
    const [add4, setAdd4] = useState("")
    const [number, setNumber] = useState("")
    const [holderName, setHolderName] = useState("")


    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="MY INFORMATION"
                action={() => {
                    props.navigation.pop()
                }}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={styles.container}>
                <View>
                    <TouchableOpacity
                        style={{ marginTop: 20, alignSelf: 'center' }}
                        activeOpacity={0.7}
                        onPress={() => {
                        }}>
                        <Image
                            style={{ height: 116, width: 116, resizeMode: 'contain' }}
                            source={require("../../../assets/andrea.png")}
                        />
                    </TouchableOpacity>
                    <View style={{}}>
                        <Text style={styles.text}>MY INFORMATION</Text>
                        <Text style={styles.text1}>Sarah</Text>
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
                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD HOME ADDRESS</Text>
                            </View> :
                                <>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                        <Image
                                            style={{ height: 24, width: 24, resizeMode: "contain" }}
                                            source={require("../../../assets/minus.png")}
                                        />
                                        <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD HOME ADDRESS</Text>
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
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => {
                                setEdit(!edit)
                            }}
                        >
                            {edit ? <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                <Image
                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                    source={require("../../../assets/plus.png")}
                                />
                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD WORK ADDRESS</Text>
                            </View> :
                                <>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                        <Image
                                            style={{ height: 24, width: 24, resizeMode: "contain" }}
                                            source={require("../../../assets/minus.png")}
                                        />
                                        <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD WORK ADDRESS</Text>
                                    </View>

                                    <CustomInput
                                        text="ADDRESS LINE 1"
                                        value={add3}
                                        onChangeText={(text) => {
                                            setAdd3(text)
                                        }}
                                    />
                                    <CustomInput
                                        text="ADDRESS LINE 2"
                                        value={add4}
                                        onChangeText={(text) => {
                                            setAdd4(text)
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={styles.save}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setEdit(!edit)
                                        }}
                                    >
                                        <Text style={styles.saveText}>
                                            Save
                                         </Text>
                                    </TouchableOpacity>
                                </>

                            }
                        </TouchableOpacity>
                        <View style={{}}>
                            <CustomInput
                                text="Type of Notification"
                                value={add3}
                            />
                        </View>
                        <View style={{ height: 40 }}></View>
                    </View>
                    <View style={{ ...styles.personalContainer, marginTop: 20 }}>
                        <Text style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>BILLING INFORMATION</Text>
                        <CustomInput
                            text="Credit Card Number"
                            value={number}
                            onChangeText={(text) => {
                                setNumber(text)
                            }}
                        />
                        <CustomInput
                            text="Credit Card Holder Name"
                            value={holderName}
                            onChangeText={(text) => {
                                setHolderName(text)
                            }}
                        />
                        <View style = {{flexDirection:'row'}}>
                        <CustomInput
                            text="Expiry Date"
                            value={number}
                            onChangeText={(text) => {
                                setNumber(text)
                            }}
                        />
                        <CustomInput
                            text="Credit Card Holder Name"
                            value={holderName}
                            onChangeText={(text) => {
                                setHolderName(text)
                            }}
                        />
                        </View>
                        <View style={{ height: 50 }}></View>
                    </View>
                </View>
                <View style={{ height: 80 }}></View>
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
                <View style={{ height: 10 }}></View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;

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
