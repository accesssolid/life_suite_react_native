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

const PersonalCare = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="PERSONAL CARE"
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
                        title1="LIFE COACH"
                        imageUrl={require("../../../assets/life.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="HAIRSTYLIST"
                        imageUrl={require("../../../assets/hair.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="YOGA"
                        imageUrl={require("../../../assets/yoga.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-evenly', top: "5%" }}>
                    <SmallCards
                        title1="NUTRITIONIST"
                        imageUrl={require("../../../assets/nutrition.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="PERSONAL TRAINER"
                        imageUrl={require("../../../assets/trainer.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                    <SmallCards
                        title1="ACUPUNCTURIST"
                        imageUrl={require("../../../assets/accu.png")}
                        action={() => {
                            props.navigation.navigate("MechanicServicesProvided")
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PersonalCare;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
})
