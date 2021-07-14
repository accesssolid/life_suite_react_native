import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Touchable, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Cards from '../../../components/cards';


const HomeScreen = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            user.user_role == 3
                                ?
                                props.navigation.navigate("ServiceProfile")
                                :
                                props.navigation.navigate("Profile")
                        }}>
                        <Image
                            style={styles.image}
                            source={require("../../../assets/women.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.search}
                        activeOpacity={0.7}
                        onPress={() => {

                        }}>
                        <Image
                            style={styles.searchImage}
                            source={require("../../../assets/search.png")}
                        />
                    </TouchableOpacity>
                </View>
                {user.user_role == 3 && <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }} activeOpacity={0.7} onPress={() => { }}>
                    <View style={{ height: 30, aspectRatio: 1 }}>
                        <Image source={require('../../../assets/addgreen.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 18, letterSpacing: 0.36, color: LS_COLORS.global.black, marginLeft: 11 }}>ADD JOB</Text>
                </TouchableOpacity>}
                {/*  */}
                {
                    user.user_role == 3
                        ?
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Cards
                                    title1=""
                                    title2="Mechanic"
                                    imageUrl={require("../../../assets/room.png")}
                                    action={() => {
                                        props.navigation.navigate("ServicesProvided");
                                    }}
                                />
                            </View>
                        </>
                        :
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Cards
                                    title1="HOME"
                                    title2="SERVICES"
                                    imageUrl={require("../../../assets/room.png")}
                                    action={() => {
                                        props.navigation.navigate("HomeServices");
                                    }}
                                />
                                <Cards
                                    title1="AUTOMATIVE"
                                    imageUrl={require("../../../assets/room.png")}
                                    action={() => {
                                        props.navigation.navigate("Automative");
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '5%' }}>
                                <Cards
                                    title1="EVENTS"
                                    imageUrl={require("../../../assets/room.png")}
                                    action={() => {
                                        props.navigation.navigate("Events");
                                    }}
                                />
                                <Cards
                                    title1="PERSONAL"
                                    title2="CARE"
                                    imageUrl={require("../../../assets/room.png")}
                                    action={() => {
                                        props.navigation.navigate("PersonalCare");
                                    }}
                                />
                            </View>
                        </>
                }


                <View style={styles.orderContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            user.user_role == 3
                                ?
                                props.navigation.navigate("OrderHistory1")
                                :
                                props.navigation.navigate("OrderHistory")
                        }}>
                        <Text style={styles.order}>
                            ORDER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        padding: 20
    },
    image: {
        resizeMode: 'contain',
        width: 44,
        height: 44,
    },
    search: {
        width: 44,
        height: 44,
        borderRadius: 100,
        borderColor: LS_COLORS.global.lightGrey,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchImage: {
        resizeMode: 'contain',
        width: 17,
        height: 17,
    },
    orderContainer: {
        justifyContent: "center",
        alignItems: 'center',
        position: 'absolute',
        bottom: "4%",
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center'
    },
    order: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})


