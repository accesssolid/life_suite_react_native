import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import { CheckBox } from 'react-native-elements'
import SureModal from '../../../components/sureModal';

/* Icons */
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomInput from '../../../components/textInput';

const CancelConfirmation = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [userData, setUserData] = useState({ ...user })
    const [isOpen, setIsOpen] = useState(false)

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <TouchableOpacity
                style={{ height: 116, aspectRatio: 1, alignSelf: 'center', position: 'absolute', zIndex: 100, top: Platform.OS === 'ios' ? "6%" : "1%", overflow: 'hidden', borderRadius: 70 }}
                activeOpacity={1}
                onPress={() => { }}>
                <Image
                    resizeMode='contain'
                    style={{ height: '100%', width: '100%', }}
                    source={userData.profile_image ? { uri: BASE_URL + userData.profile_image } : require("../../../assets/user.png")}
                />
            </TouchableOpacity>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: '20%' }}
                style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, alignSelf: 'center', marginBottom: 16 }}>SUSPEND IN PROGRESS</Text>
                    <View style={{ height: 70, aspectRatio: 1, borderRadius: 35, overflow: 'hidden', alignSelf: 'center' }}>
                        <Image source={require('../../../assets/man.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 18, color: LS_COLORS.global.textCyan, alignSelf: 'center', marginTop: 6 }}>Alexi</Text>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 12, color: LS_COLORS.global.darkGray, marginTop: 2, alignSelf: 'center' }}>$15</Text>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsLight, fontSize: 14, color: LS_COLORS.global.darkBlack, marginTop: 10, alignSelf: 'center' }}>I am a Professional Mechanic having 4y exp.</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>Time</Text>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>10:00 am</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, alignItems: 'center' }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>Rating</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {[1, 2, 3, 4].map((item, index) => {
                                return (<FontAwesome key={index} name="star" size={12} color={LS_COLORS.global.textCyan} style={{ marginRight: 5 }} />)
                            })}
                        </View>
                    </View>
                    {[1, 2].map((item, index) => {
                        return (<View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }}>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>Task 1</Text>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.darkBlack, }}>$10</Text>
                        </View>)
                    })}
                </View>
                <Text style={{ alignSelf: 'center', textAlign: 'center', width: '75%', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, marginTop: 30 }}>
                    You will be charged a 25% fee or $5.00 whichever is more if within 24 hours
                </Text>
            </ScrollView>
            <View style={{ paddingBottom: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: LS_COLORS.global.white }}>
                <CustomButton action={() => setIsOpen(!isOpen)} title="Yes, Suspend" customStyles={{ paddingHorizontal: 15, width: '100%', height: 40, marginTop: 10 }} />
                <CustomButton action={() => props.navigation.goBack()} title="Keep Order" customStyles={{ paddingHorizontal: 15, width: '100%', height: 40, marginTop: 10 }} />
            </View>
            <SureModal
                pressHandler={() => {
                    setIsOpen(!isOpen);
                }}
                action={() => { setIsOpen(!isOpen), props.navigation.navigate('HomeScreen') }}
                visible={isOpen}
                action1={() => {
                    setIsOpen(!isOpen);
                }}
            />
        </SafeAreaView>
    )
}

export default CancelConfirmation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
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
