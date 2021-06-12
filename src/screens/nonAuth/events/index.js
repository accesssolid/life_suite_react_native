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

const Events = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header 
            title="Events" 
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
                        title1="WEDDING PLANNER"
                        imageUrl={require("../../../assets/wedding.png")}
                    />
                    <SmallCards
                        title1="BAND"
                        imageUrl={require("../../../assets/band.png")}
                    />
                    <SmallCards
                        title1="SINGER"
                        imageUrl={require("../../../assets/singer.png")}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent:'space-evenly',top:"5%"}}>
                    <SmallCards
                        title1="CHEF/COOK"
                        imageUrl={require("../../../assets/chef.png")}
                    />
                    <SmallCards
                        title1="DJ"
                        imageUrl={require("../../../assets/dj.png")}
                    />
                    <SmallCards
                      title1 = "PHOTOGRAPHER"
                      imageUrl={require("../../../assets/photo.png")}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Events;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
})
