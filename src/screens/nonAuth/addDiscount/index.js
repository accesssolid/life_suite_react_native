import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';
import { Content, Container } from 'native-base'
/* Components */
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';

const types = ["Flat Amount", "Percentage"]

export default function AddDiscount({ navigation, route }) {
    const [type, setType] = React.useState("Flat Amount")
    const { discount, setDiscount,totalPrice } = route.params ?? {}
    const [flat_amount, setFlatAmount] = React.useState("")
    const [per_amount, setPerAmount] = React.useState("")
    const [totalPrice1,setTotalPrice1]=React.useState(0)
    
    React.useEffect(() => {
        setTotalPrice1(totalPrice)
        if (discount?.discount_type == "flat") {
            setType(types[0])
            setFlatAmount(discount.discount_amount)
        } else if (discount?.discount_type == "per") {
            setType(types[1])
            setPerAmount(discount.discount_amount)
        }
    }, [discount, setDiscount,totalPrice])

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="ADD DISCOUNT"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    navigation.navigate("HomeScreen")
                }}
            />
            <Container>
                <Content>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, alignItems: "center", paddingHorizontal: 20 }}>
                        <Text style={styles.textStyle}>DISCOUNT</Text>
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
                                    <TextInput value={flat_amount}  onChangeText={t => setFlatAmount(t)} keyboardType={"numeric"} placeholder={"Flat Amount"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                                </View>
                            </View>}
                        {type == types[1] &&
                            <><View style={{ width: "40%", alignSelf: "center", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                <TextInput  value={`per_amount+"%"`} onChangeText={t => setPerAmount(t)} placeholder={"Enter Percentage"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                            </View>
                                <View style={{ width: "40%", alignSelf: "center", borderRadius: 6, height: 40, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                                    <TextInput maxLength={2} value={(String(Number(per_amount)*totalPrice/100))??""} keyboardType={"numeric"} placeholder={"Calculated Amount"} placeholderTextColor="black" style={{ height: 40 }} textAlign="center" />
                                </View>
                            </>
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
                        navigation.pop()
                    }}>
                    <Text style={styles.saveText}>Confirm</Text>
                </TouchableOpacity>
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