import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import SmallCards from '../../../components/smallCards';

const Automative = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Automative"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

            />
            <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                    <SmallCards
                        title1="HANDYMAN"
                        imageUrl={require("../../../assets/handyMan.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="GARDENER"
                        imageUrl={require("../../../assets/gardener.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="HOUSE CLEANING"
                        imageUrl={require("../../../assets/cleaning.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-evenly', top: "5%" }}>
                    <SmallCards
                        title1="MOVING TRUCK"
                        imageUrl={require("../../../assets/truck.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="TOW TRUCK"
                        imageUrl={require("../../../assets/towtTruck.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        style={{ borderColor: 'white' }}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />                
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Automative;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
})
