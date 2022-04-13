import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native'
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';
import { Content, Container } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context';
/* Components */
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import Loader from '../../../components/loader';
const types = ["Flat Amount", "Percentage"]

export default function AddDiscount({ navigation, route }) {
    const [type, setType] = React.useState("Flat Amount")
    const { discount, setDiscount, totalPrice, order_id } = route.params ?? {}
    const [flat_amount, setFlatAmount] = React.useState("")
    const [per_amount, setPerAmount] = React.useState("")
    const [totalPrice1, setTotalPrice1] = React.useState(0)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loader, setLoader] = React.useState(false)
    React.useEffect(() => {
        setTotalPrice1(totalPrice)
        if (discount?.discount_type == "flat") {
            setType(types[0])
            setFlatAmount(discount.discount_amount)
        } else if (discount?.discount_type == "per") {
            setType(types[1])
            setPerAmount(discount.discount_amount)
        }
    }, [discount, setDiscount, totalPrice])

    const addDiscount = async (data) => {

        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            const formdata=new FormData()
            formdata.append("order_id",order_id)
            formdata.append("discount_type","flat")
            formdata.append("discount_amount",data.discount_amount)

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/addDiscountOrder',
                type: 'post'
            }
            const response = await getApi(config)
            if (response.status) {
                showToast("Discount added successfully")
               navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item:{id:order_id} } })

            } else {
                showToast(response.message)
            }
        } catch (Err) {

        } finally {
            setLoader(false)

        }
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="ADD DISCOUNT"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

            // imageUrl1={require("../../../assets/home.png")}
            // action1={() => {
            //     navigation.navigate("MainDrawer")
            // }}
            />
            <Container>
                <Content>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, alignItems: "center", paddingHorizontal: 20 }}>
                        <Text maxFontSizeMultiplier={1.3}  style={styles.textStyle}>DISCOUNT</Text>
                        <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center", }}>
                            <DropDown
                                item={types}
                                value={type}
                                handleTextValue={true}
                                onChangeValue={(index, value) => { setType(value) }}
                                containerStyle={{ width: "60%", borderRadius: 6, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey, borderWidth: 0 }}
                                dropdownStyle={{ width: "40%", height: 90, marginTop: Platform.OS == "android" ? -30 : 0 }}
                            />
                        </View>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between", paddingHorizontal: 20 }}>
                        {type == types[0] &&
                            <View style={{ alignItems: "center", width: "100%" }}>
                                <View style={{ borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <TextInput maxFontSizeMultiplier={1.3} value={flat_amount} onChangeText={t => setFlatAmount(t)} keyboardType={"numeric"} placeholder={"Flat Amount ($)"} placeholderTextColor="black" style={{ height: 40,minWidth:100,color:"black"  }} textAlign="center" />
                                </View>
                            </View>}
                        {type == types[1] &&
                            <View style={{ alignItems: "center", width: "100%" }}>
                                <View style={{  alignSelf: "center", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <TextInput maxFontSizeMultiplier={1.3} value={per_amount} onChangeText={t => setPerAmount(t)} placeholder={"Enter Percentage (%)"} keyboardType={"numeric"} placeholderTextColor="black" style={{ height: 40,minWidth:100,color:"black" }} textAlign="center" />
                                </View>
                                <View style={{ alignSelf: "center", borderRadius: 6, height: 40, marginTop: 20, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <Text maxFontSizeMultiplier={1.3} style={{ height: 40, textAlign: "center", textAlignVertical: "center", lineHeight: 40,minWidth:100 }} >{Number(parseFloat(Number(per_amount) * totalPrice / 100).toFixed(2)) ?? "Calculated Amount"}</Text>
                                </View>
                            </View>
                        }
                    </View>
                </Content>
                <TouchableOpacity
                    style={[styles.save, { marginVertical: 10, borderRadius: 25 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        setDiscount({
                            discount_type: type == types[0] ? "flat" : "per",
                            discount_amount: type == types[0] ? flat_amount : per_amount
                        })
                        addDiscount({
                            discount_type: type == types[0] ? "flat" : "per",
                            discount_amount: type == types[0] ? flat_amount : Number(parseFloat(Number(per_amount) * totalPrice / 100).toFixed(2))
                        })
                    }}>
                    <Text maxFontSizeMultiplier={1.3} style={styles.saveText}>Confirm</Text>
                </TouchableOpacity>
                {loader && <Loader />}
            </Container>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        alignSelf: 'center',
        textAlign: "center"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: "40%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },

})