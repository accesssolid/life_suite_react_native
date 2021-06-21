import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Touchable, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import MediumCards from '../../../components/mediumCard';


const addJob = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            props.navigation.navigate("ServiceProfile");
                        }}
                    >
                        <Image
                            style={styles.image}
                            source={require("../../../assets/man.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.search}
                        activeOpacity={0.7}
                        onPress={() => {

                        }}
                    >
                        <Image
                            style={styles.searchImage}
                            source={require("../../../assets/search.png")}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 30, width: '30%' }}
                    activeOpacity={0.7}
                    onPress={() => {

                    }}
                >
                    <Image
                        style={styles.plusImage}
                        source={require("../../../assets/addgreen.png")}
                    />
                    <Text style={{ alignSelf: 'center', marginLeft: 10, fontSize: 18, fontFamily: LS_FONTS.PoppinsMedium }}>Add Job</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MediumCards
                        title1="HOME"
                        title2="SERVICES"
                        imageUrl={require("../../../assets/handyMan.png")}
                        action={() => {
                           
                        }}
                    />

                </View>

                <View style={styles.orderContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {

                        }}
                    >
                        <Text style={styles.order}>
                            ORDER
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default addJob;

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
    },
    plusImage: {
        resizeMode: 'contain',
        width: 25,
        height: 25,
    }
})


