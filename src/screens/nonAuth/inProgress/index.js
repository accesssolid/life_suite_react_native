import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';

/* Icons */
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomButton from '../../../components/customButton';

const InProgress = (props) => {
    const dispatch = useDispatch()

    const progressData = [
        {
            desc: "Job has been delayed",
            time: "~10 minutes"
        },
        {
            desc: "Est.Appt. Start Time:",
            time: "10:00 am"
        },
        {
            desc: "Est. New Start Time:",
            time: "10:10 am"
        },
        {
            desc: "Est. New End Time:",
            time: "12:40 pm"
        },
    ]

    const chatData = [
        {
            user: "other",
            text: "Hello, I'm here to start on the job. I see the car. but I don't see you?"
        },
        {
            user: "me",
            text: "Hello, I'm here to start on the job. I see the car. but I don't see you?"
        },
    ]

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="In Progress"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <Content
                    style={{ paddingTop: 15 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {/* Provider Profile */}
                    <View style={styles.topContainer}>
                        <View style={{ flexDirection: 'row', height: 70, }}>
                            <View style={{ height: '100%', aspectRatio: 1, borderRadius: 35, overflow: 'hidden' }}>
                                <Image source={require('../../../assets/man.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={{ paddingLeft: 12, justifyContent: 'space-between', paddingVertical: 5, flex: 1 }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.textCyan }}></Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.textCyan }}>Alexi</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black }}>Australia</Text>
                            </View>
                            <View style={{ alignSelf: 'flex-end', paddingVertical: 5, justifyContent: 'space-between', height: '100%' }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.textCyan }}>2.5hrs</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.textCyan, marginBottom: 4 }}>$15</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black }}>2/2/2021</Text>
                            </View>
                        </View>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 12, color: LS_COLORS.global.darkBlack, marginTop: 13 }}>I am a Professional Mechanic having 4y exp.</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.textCyan, marginRight: 5 }}>Rating</Text>
                            {[1, 2, 3, 4, 5].map((item, index) => {
                                return (<FontAwesome key={index} name="star" size={12} color={LS_COLORS.global.textCyan} style={{ marginRight: 5 }} />)
                            })}
                        </View>
                        <View style={{ marginVertical: 15, borderTopWidth: 1, borderTopColor: LS_COLORS.global.divider }} />
                        {[1, 2, 3].map((item, index) => {
                            return (<View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>Task 1</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>$10</Text>
                            </View>)
                        })}
                    </View>
                    <View style={{ paddingHorizontal: 23, marginTop: 33 }}>
                        {progressData.map((item, index) => {
                            return (<View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack, }}>{item.desc}</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.textCyan, }}>{item.time}</Text>
                            </View>)
                        })}
                    </View>
                    <View style={{ ...styles.topContainer, marginTop: 37 }}>
                        {chatData.map((item, index) => {
                            if (item.user == "me") {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', width: '85%', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                                        <View style={{ height: 30, aspectRatio: 1, borderRadius: 30, backgroundColor: LS_COLORS.global.textCyan, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: LS_COLORS.global.white }}>{item.user[0].toUpperCase()}</Text>
                                        </View>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 12, color: LS_COLORS.global.darkBlack, width: '85%' }}>{item.text}</Text>
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignSelf: 'flex-end', width: '85%', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 12, color: LS_COLORS.global.darkBlack, width: '85%' }}>{item.text}</Text>
                                        <View style={{ height: 30, aspectRatio: 1, borderRadius: 30, backgroundColor: LS_COLORS.global.textCyan, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: LS_COLORS.global.white }}>{item.user[0].toUpperCase()}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })}
                    </View>
                    <CustomButton title="Send Message" customStyles={{ width: '50%', height: 40, marginTop: 28 }} />
                    <View style={{ alignItems: 'center', marginVertical: 15, marginTop: 30, justifyContent: 'center' }}>
                        <Text style={{ backgroundColor: LS_COLORS.global.white, zIndex: 5, paddingHorizontal: 15, fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, }}>Job is in progress.</Text>
                        <View style={{ position: 'absolute', borderTopWidth: 2, borderTopColor: LS_COLORS.global.textCyan, width: '85%', }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width:'85%', alignSelf:'center' }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack, }}>Actual Start Time:</Text>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>10:10 am</Text>
                    </View>
                </Content>
                <CustomButton action={() => props.navigation.navigate('SuspendInProgress')} title="Suspend" customStyles={{ width: '50%', height: 40, marginTop: 10 }} />
            </Container>
        </SafeAreaView>
    )
}

export default InProgress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    topContainer: {
        width: '90%',
        alignSelf: 'center',
        padding: 17,
        borderRadius: 10,
        backgroundColor: LS_COLORS.global.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        marginVertical: 5
    }
})
