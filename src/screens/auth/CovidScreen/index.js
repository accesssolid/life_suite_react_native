import React from 'react'
import { View, StyleSheet, Image, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, ImageBackground, Linking } from 'react-native'
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import CustomButton from '../../../components/customButton';
import { CheckBox } from 'react-native-elements';

export default function CovidScreen(props) {
    const [checked, setChecked] = React.useState(false)
    const {onChecked,isChecked} =props.route.params
    React.useEffect(()=>{
        if(isChecked){
            setChecked(isChecked)
        }else{
            setChecked(false)
        }
    },[isChecked])
    return (
        <SafeAreaView style={[globalStyles.safeAreaView, { backgroundColor: "white" }]}>
            <ScrollView>
                <View style={{
                    height: 200,
                    aspectRatio:(1009/586),
                    alignSelf: "center", 
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderRadius:10,
                    backgroundColor:"white",
                    marginVertical:30
                }} >
                    <Image source={require("../../../assets/covid/head_image.png")} style={{ width: "100%", height: "100%" }} resizeMode='contain' />
                </View>
                <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 20, fontSize: 18, textAlign: "center", color: "black" }}>
                    Health safety commitments
                </Text>
                <View style={{ flexDirection: "row",marginTop:20 ,marginHorizontal:"5%"}}>
                    <CheckBox
                        style={{margin:0}}
                        containerStyle={{ margin: 0, padding: 0,marginLeft:0,marginRight:0 }}
                        wrapperStyle={{ margin: 0, padding: 0 }}
                        checked={checked}
                        onPress={() => setChecked(!checked)}
                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                        // title=": Dont't provide or receive any services if you have COVID-19 or have any related symptoms."
                        titleProps={{
                            style:{
                                width:0,marginHorizontal:0
                            }
                        }}
                    />
                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, flex: 1, fontSize: 15, textAlign: "left", color: "black" }}> : Dont't provide or receive any services if you have COVID-19 or have any related symptoms.</Text>
                </View>
                <Text onPress={() => Linking.openURL("https://cdc.gov")} style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 14, textDecorationLine: "underline", marginTop: 20, textAlign: "center", color: "blue" }}>
                    View CDC guidelines
                </Text>
            </ScrollView>
            <CustomButton action={() => {
                if (checked) {
                    onChecked(1)
                }else{
                    onChecked(0)
                }
                props.navigation.goBack()
            }} title="Next" customStyles={{ borderRadius: 5, marginBottom: 20, width: "50%" }} />
            {/* <Image source={require("../../../assets/covid/text.png")} resizeMode='contain' style={{ width: "90%",backgroundColor:"red", height: "40%", alignSelf: "center" }} /> */}
        </SafeAreaView>
    )
}