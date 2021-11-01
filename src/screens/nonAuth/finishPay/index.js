import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';
import { Content, Container } from 'native-base'
import { getApi } from '../../../api/api';
import { useSelector } from 'react-redux';
/* Components */
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { Rating } from 'react-native-ratings';
import Loader from '../../../components/loader';
import { order_types } from '../../../constants/globals';
const types = ["Flat Amount", "Percentage"]

export default function FinishPay({ navigation, route }) {
    const [type, setType] = React.useState(types[0])
    const { item} = route.params ?? {}
    const [flat_amount, setFlatAmount] = React.useState("")
    const [per_amount, setPerAmount] = React.useState("")
    const [totalPrice,setTotalPrice]=React.useState(0)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [rating, setRating] = React.useState("1")
    const [reason,setReason]=React.useState("")
    const [loading,setLoading]=React.useState(false)
    React.useEffect(()=>{
        if(item){
            if(item.order_total_price){
                setTotalPrice(item.order_total_price)
            }
        }
    },[item])

    const submit = () => {
        // console.log(selectedStartTime)
        // return 
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        const datac = {
            order_id: item.id,
            order_status: order_types.completed,
            rating_comment: reason,
            rating:rating,
            tip:type==types[0]?flat_amount:(Number(per_amount)*Number(totalPrice)/100)
        }
        let config = {
            headers: headers,
            data: JSON.stringify(datac),
            endPoint: "/api/customerOrderStatusUpdate",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    navigation.pop()
                } else {
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Finish & Pay"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
            // imageUrl1={require("../../../assets/home.png")}
            // action1={() => {
            //     navigation.navigate("HomeScreen")
            // }}
            />
            <Container>
                <Content>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                        <Text style={[styles.textStyle, { fontSize: 14 }]}>Rate this Job</Text>
                        <Rating
                            imageSize={30}
                            type="custom"
                            ratingBackgroundColor="gray"
                            ratingColor="#04BFBF"
                            tintColor="white"
                            onFinishRating={(rating) => {
                                setRating(rating)
                            }}
                            startingValue={1}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, alignItems: "center", paddingHorizontal: 20 }}>
                        <Text style={[styles.textStyle, { fontSize: 14 }]}>TIP</Text>
                        <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center", }}>
                            <DropDown
                                item={types}
                                value={type}
                                onChangeValue={(index, value) => { setType(value) }}
                                containerStyle={{ width: "60%", borderRadius: 6, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey, borderWidth: 0 }}
                                dropdownStyle={{ width: "40%", height: 100 }}
                            />
                        </View>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between", paddingHorizontal: 20 }}>
                        {type == types[0] &&
                            <View style={{ alignItems: "center", width: "100%" }}>
                                <View style={{ width: "40%", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <TextInput value={flat_amount} onChangeText={t => setFlatAmount(t)} keyboardType={"numeric"} placeholder={"Tip Amount"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                                </View>
                            </View>}
                        {type == types[1] &&
                            <><View style={{ width: "40%", alignSelf: "center", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                <TextInput value={per_amount} onChangeText={t => setPerAmount(t)} placeholder={"Enter Percentage"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                            </View>
                                <View style={{ width: "40%", alignSelf: "center", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <TextInput maxLength={2} value={(String(Number(per_amount) * totalPrice / 100)) ?? ""} keyboardType={"numeric"} placeholder={"Calculated Amount"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                                </View>
                            </>
                        }
                    </View>
                    <View style={{ width: "90%",alignSelf:"center",marginTop:20, borderRadius: 6, height: 200, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                        <TextInput value={reason} multiline={true} onChangeText={t => setReason(t)} textAlignVertical="top"  placeholder={"Your Comments"}  placeholderTextColor="gray" style={{ height: 200}}/>
                    </View>
                </Content>
                <TouchableOpacity
                    style={[styles.save, { marginVertical: 10, borderRadius: 25 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        submit()
                    }}>
                    <Text style={styles.saveText}>Confirm</Text>
                </TouchableOpacity>
            </Container>
            {loading&&<Loader />}
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