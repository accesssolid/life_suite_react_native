import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import { globalStyles } from '../utils';
import LS_FONTS from '../constants/fonts';
import Loader from '../components/loader';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import TextInputMask from 'react-native-text-input-mask';

/* Components */;
import Header from '../components/header';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../api/api';
import CustomButton from '../components/customButton';
import { setAddServiceData } from '../redux/features/services';
import { showToast } from '../components/validators';

const ServiceItem = (props) => {
    const dispatch = useDispatch()
    const priceRef = useRef(null)
    const hourRef = useRef(null)
    const minRef = useRef(null)

    return (
        <View style={{ width: '98%', flexDirection: "row", alignItems: 'center', alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                <CheckBox
                    checked={props.isSelected}
                    onPress={props.onCheckPress}
                    checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                    uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                />
                <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%' }}>{props.item.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                <View style={styles.fromContainer}>
                    <TextInput
                        style={styles.inputStyle}
                        color="black"
                        placeholder="$000"
                        editable={props.isSelected}
                        onChangeText={(text) => props.setText("price", text, props.index)}
                        keyboardType="numeric"
                        value={props.serviceItem?.price}
                        ref={priceRef}
                        returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                        onSubmitEditing={() => hourRef.current.focus()}
                    />
                </View>
                <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                    <TextInputMask
                        onChangeText={(formatted, extracted) => {
                            props.setText("time_duration_h", extracted, props.index)
                        }}
                        mask={"[00]"}
                        color="black"
                        placeholder="HH"
                        keyboardType="numeric"
                        editable={props.isSelected}
                        style={styles.inputStyle}
                        value={props.serviceItem?.time_duration_h}
                        ref={hourRef}
                        returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                        onSubmitEditing={() => minRef.current.focus()}
                    />
                </View>
                <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                    <TextInputMask
                        onChangeText={(formatted, extracted) => {
                            props.setText("time_duration_m", extracted, props.index)
                        }}
                        mask={"[00]"}
                        color="black"
                        placeholder="MM"
                        keyboardType="numeric"
                        editable={props.isSelected}
                        style={styles.inputStyle}
                        value={props.serviceItem?.time_duration_m}
                        ref={minRef}
                        returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                    />
                </View>
            </View>
        </View>
    )
}

export default ServiceItem;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    mechanic: {
        fontSize: 29,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    price: {
        width: '100%',
        alignSelf: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    priceTime: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        marginRight: '13%'
    },
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 174,
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
    fromContainer: {
        height: 40,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        marginRight: '10%'
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
})