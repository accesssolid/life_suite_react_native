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

const HomeServices = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header 
            title="Home Services" 
            action = {() => {
                props.navigation.pop()
            }}
            action1 = {() => {
                props.navigation.navigate("HomeScreen")
            }}
            />
            <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                    <SmallCards
                        title1="PLUMBING"
                        imageUrl={require("../../../assets/plumbing.png")}
                    />
                    <SmallCards
                        title1="GARDENER"
                        imageUrl={require("../../../assets/gardener.png")}
                    />
                    <SmallCards
                        title1="HOUSE CLEANING"
                        imageUrl={require("../../../assets/cleaning.png")}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent:'space-evenly',top:"5%"}}>
                    <SmallCards
                        title1="HANDYMAN"
                        imageUrl={require("../../../assets/handyMan.png")}
                    />
                    <SmallCards
                        title1="ELECTRICIAN"
                        imageUrl={require("../../../assets/electrician.png")}
                    />
                    <SmallCards
                       style = {{borderColor:'white'}}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
   
})
