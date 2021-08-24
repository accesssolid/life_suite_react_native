import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import DropDown from '../../../components/dropDown';
import CustomTextInput from '../../../components/customTextInput';

const OrderHistory = (props) => {
    const dispatch = useDispatch()
    const [selected, setselected] = useState(null)

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="ORDER HISTORY"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <Content
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>

                    <DropDown
                        item={["Declined", "Completed", "In progress"]}
                        value={'Declined'}
                        // onChangeValue={(index, value) => { setNotificationType(value), user.user_role == 2 ? cardNumberRef.current.focus() : null }}
                        containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, paddingHorizontal: '5%', borderWidth: 0, marginTop: 14 }}
                        dropdownStyle={{ height: 120 }}
                    />
                    <CustomTextInput
                        placeholder="Search"
                        customContainerStyle={{ marginHorizontal: '5%', marginBottom: 0 }}
                        customInputStyle={{ borderRadius: 6, paddingHorizontal: '10%', }}
                    />
                    <Text style={{ fontSize: 16, marginTop: 20, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium }}>ORDERS</Text>
                    {[1, 2, 3, 4, 5].map((item, index) => {
                        if (selected !== index) {
                            return (<TouchableOpacity key={index} activeOpacity={0.7} onPress={() => { setselected(index) /* props.navigation.navigate("InProgress") */ }} style={{ height: 72, width: "95%", marginTop: 3, padding: 10, alignSelf: 'center', borderRadius: 12, backgroundColor: "#DCFBBD" }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Image
                                            style={{ height: 50, width: 50, resizeMode: 'contain' }}
                                            source={require("../../../assets/mecman.png")}
                                        />
                                    </View>
                                    <View style={{ justifyContent: 'center', paddingLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Alexi</Text>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular }}>Mechanic</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, }}>Start Time</Text>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkBlack }}>April 20 at 10:10 am</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        } else {
                            return (
                                <>
                                    <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => { setselected(null) /* props.navigation.navigate('UpcomingOrder') */ }}>
                                        <Card style={styles.alexiContainer}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Image
                                                        style={{ height: 100, width: 100, resizeMode: 'contain' }}
                                                        source={require("../../../assets/mecman.png")}
                                                    />
                                                    <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}>Rating * * * * *</Text>

                                                </View>
                                                <View style={{ right: 10, top: "8%" }}>
                                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Alexi</Text>
                                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Australia</Text>
                                                </View>
                                                <View style={{}}>
                                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Upcoming</Text>
                                                </View>
                                                <View style={{}}>
                                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}>2.5Hrs</Text>
                                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green }}>$15</Text>
                                                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: 'black' }}>2/2/2021</Text>
                                                </View>
                                            </View>
                                            <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>Task 1</Text>
                                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsRegular }}>$10</Text>
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>Task 2</Text>
                                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsRegular }}>$10</Text>
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>Task 3</Text>
                                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>$10</Text>
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>Time</Text>
                                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green }}>2.5 hrs</Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginBottom: 30 }}>
                                        <TouchableOpacity
                                            style={styles.save}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                            }}>
                                            <Text style={styles.saveText}>
                                                Chat
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.save}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                            }}>
                                            <Text style={styles.saveText}>
                                                Cancel Order
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        }
                    })}
                    <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 20 }}></View>
                    <View style={{ height: 30 }}></View>
                </Content>
            </Container>
        </SafeAreaView>
    )
}

export default OrderHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "95%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
