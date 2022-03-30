import React from 'react'
import { View, StyleSheet, Image, Text, SafeAreaView, Dimensions, ScrollView, Platform, ImageBackground, Linking } from 'react-native'
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import CustomButton from '../../../components/customButton';
import { CheckBox } from 'react-native-elements';
import { getApi } from '../../../api/api';
const {height,width}=Dimensions.get("window")
export default function CovidScreen(props) {
    const [checked, setChecked] = React.useState(false)
    const {onChecked,isChecked} =props.route.params
    const [text_data,setTextData]=React.useState("")
    React.useEffect(()=>{
        if(isChecked){
            setChecked(isChecked)
        }else{
            setChecked(false)
        }
    },[isChecked])

    React.useEffect(()=>{
        getData()
    },[])
    
    const getData= async () => {
        try {

            let headers = {
                "Content-Type": "application/json"
            }

            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/cdd',
                type: 'post'
            }
            let res = await getApi(config)
    
            if (res.status) {
                if(res.data?.text_data){
                    setTextData(res.data?.text_data?.replace(/<\/?[^>]+(>|$)/g, ""))
                }else{
                    setTextData("Dont't provide or receive any services if you have COVID-19 or have any related symptoms.")

                }
                
            }
        } catch (err) {

        }
    }

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
                <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 20, fontSize: 18, textAlign: "center", color: "black" }}>
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
                        titleProps={{
                            style:{
                                width:0,marginHorizontal:0
                            }
                        }}
                    />
                    <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsRegular, flex: 1, fontSize: 15, textAlign: "left", color: "black" }}> {text_data}</Text>
                </View>
                <Text maxFontSizeMultiplier={1.7} onPress={() => Linking.openURL("https://cdc.gov")} style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 14, textDecorationLine: "underline", marginTop: 20, textAlign: "center", color: "blue" }}>
                    View CDC guidelines
                </Text>
            </ScrollView>
            <View style={{flexDirection:"row",justifyContent:"space-evenly",paddingBottom:10}}>
                    <CustomButton action={()=>{
                       onChecked(1)
                        props.navigation.goBack()
                    }} title="I accept" customStyles={{marginBottom:0,borderRadius:5,width:width*0.45}} />
                    <CustomButton 
                    action={()=>{
                        onChecked(0)
                        props.navigation.goBack()
                    }}
                    title="I don't accept" customStyles={{marginBottom:0,borderRadius:5,width:width*0.45}} />
                </View> 
            {/* <CustomButton action={() => {
                if (checked) {
                  
                }else{
                  
                }
                props.navigation.goBack()
            }} title="Next" customStyles={{ borderRadius: 5, marginBottom: 20, width: "50%" }} /> */}
            {/* <Image source={require("../../../assets/covid/text.png")} resizeMode='contain' style={{ width: "90%",backgroundColor:"red", height: "40%", alignSelf: "center" }} /> */}
        </SafeAreaView>
    )
}