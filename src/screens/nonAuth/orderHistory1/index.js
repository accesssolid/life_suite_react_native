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

const OrderHistory1 = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="ORDER HISTORY"
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
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={{ fontSize: 16, marginTop: 20, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium }}>ORDERS</Text>
                    <View style={{ height: 72, width: "95%", marginTop: 3, padding: 10, alignSelf: 'center', backgroundColor: LS_COLORS.global.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 50, width: 50, resizeMode: 'contain' }}
                                        source={require("../../../assets/mecman.png")}
                                    />
                                </View>
                                <View style={{ left: 20, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Mechanic</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>April 20 at 10:10am</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, }}>$50</Text>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>4.9*</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
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
                        style={{ height: 87, alignSelf: 'center', width: "95%", marginTop: "10%" }}
                        source={require("../../../assets/map.png")}
                    />
                    <View style={{ height: 40, width: '90%', alignSelf:'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{width:92,...styles.upper}} >
                            <Text style={styles.upperText}>Start Job</Text>
                        </View>
                        <View style={{width:128,...styles.upper}} >
                            <Text style={styles.upperText}>Delay Start Time</Text>
                        </View>
                        <View style={{width:100,...styles.upper}} >
                            <Text style={styles.upperText}>Cancel Order</Text>
                        </View>
                        
                    </View>
                   
                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, marginTop: "10%", marginLeft: 20 }}>HISTORY</Text>
                    <View style={{ height: 72, width: "95%", marginTop: 20, padding: 10, alignSelf: 'center', borderRadius: 12, backgroundColor: LS_COLORS.global.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
                          <View>
                            <Image
                                    style={{ height: 50, width: 50, resizeMode: 'contain' }}
                                    source={require("../../../assets/photographer.png")}
                                />
                                </View>
                            <View style={{ marginRight:'30%'}}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Photographer</Text>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>April 20 at 10:10am</Text>
                            </View>
                            <View style={{ justifyContent:"flex-start"}}>
                            <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, marginTop: 10 }}>Declined</Text>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green,alignSelf:'flex-end' }}>$50</Text>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green,alignSelf:"flex-end" }}>4.9*</Text>
                            </View>
                        </View>

                    </View>
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
                        style={{ height: 87, alignSelf: 'center', width: "95%", marginTop: "10%" }}
                        source={require("../../../assets/map.png")}
                    />
                    <View style={{  marginTop: 10 }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                            }}
                        >
                            <Text style={styles.saveText}>
                                Block/Unblock
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 72, width: "95%", marginTop: 3, padding: 10, alignSelf: 'center', backgroundColor: LS_COLORS.global.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 50, width: 50, resizeMode: 'contain' }}
                                        source={require("../../../assets/mecman.png")}
                                    />
                                </View>
                                <View style={{ left: 20, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Mechanic</Text>
                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>April 20 at 10:10am</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, }}>$50</Text>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>4.9*</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                    <View style={{ height: 30 }}></View>
                </Content>
            </Container>
        </SafeAreaView>
    )
}

export default OrderHistory1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    alexiContainer: {
        maxHeight: '100%',
        top: "1%",
        width: "95%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
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
    },
    upper: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: '10%'
    },
    upperText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    }
})
