import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import { BASE_URL, getApi } from '../../../api/api';
import Cards from '../../../components/cards';

/* Icons */
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomButton from '../../../components/customButton';

export default function SelectService({ navigation, route }) {
    const myJobs = useSelector(state => state.provider.myJobs)
    
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Services"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    navigation.navigate("HomeScreen")
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

            />
            <View style={styles.container}>
                <FlatList
                    data={[...myJobs]}
                    style={{ marginTop: 20 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <Cards
                                titleStyle={{ fontSize: 13, textAlign: "center", width: "100%" }}
                                customContainerStyle={{ width: "90%", alignSelf: "center", aspectRatio: 2 }}
                                title1={item.name}
                                imageUrl={{ uri: BASE_URL + item.image }}
                                action={() => {
                                    // navigation.navigate("UpdateCertificates", { service_id: item.id, title: item.name ,service:item})
                                    navigation.navigate("LocationUpdate", { service_id: item.id, title: item.name ,subService:item})
                                }}
                            />
                        )
                    }}
                    keyExtractor={(item, index) => index}
                />
            </View>
        </SafeAreaView>
    )
}


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
