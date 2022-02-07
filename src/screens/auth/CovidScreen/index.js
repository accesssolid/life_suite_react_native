import React from 'react'
import { View, StyleSheet, Image, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native'
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import CustomButton from '../../../components/customButton';
export default function CovidScreen(props) {
    return (
        <SafeAreaView style={[globalStyles.safeAreaView, { backgroundColor: "white" }]}>
            <ScrollView>
            <View style={{
                width: "90%", height:210, alignSelf: "center", shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }} >
            <Image source={require("../../../assets/covid/head_image.png")} style={{ width: "100%", height: "100%", alignSelf: "center" }} resizeMode='contain' />
            </View>
            <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold,marginTop:20,fontSize: 18, textAlign: "center", color: "black" }}>
                Health safety commitments
            </Text>

            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15, textAlign: "center", marginHorizontal: 5, color: "black" }}>
                Check box: Dont't provide or receive any services if you have COVID-19 or have any related symptoms.
            </Text>

            <Text style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 14, textDecorationLine: "underline", marginTop: 20, textAlign: "center", color: "blue" }}>
                View CDC guidelines
            </Text>
            </ScrollView>
            <CustomButton action={()=>props.navigation.goBack()} title="Back" customStyles={{borderRadius:5,marginBottom:20,width:"50%"}}/>
            {/* <Image source={require("../../../assets/covid/text.png")} resizeMode='contain' style={{ width: "90%",backgroundColor:"red", height: "40%", alignSelf: "center" }} /> */}
        </SafeAreaView>
    )
}