import React, { useEffect, useRef, useState, useImperativeHandle, useReducer } from 'react';
import { View, StyleSheet, Text, Platform, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import TextInputMask from 'react-native-text-input-mask';
import { Container, Content, InputGroup, Row, } from 'native-base'

/* Components */;
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import _ from 'lodash';

const ServiceItem = React.forwardRef((props, ref) => {
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)

    const priceRef = useRef(null)
    const hourRef = useRef(null)
    const minRef = useRef(null)
    const nameRef = useRef(null)
    const priceNewRef = useRef(null)

    useEffect(() => {
        setInitialServiceData()
    }, [])

    useImperativeHandle(ref, () => ({
        updateData: async () => {
        },
        reset: () => {
        },
    }));

    const setInitialServiceData = () => {
        let selectedPrev = []
        props.item.products.map((item, index) => {
            selectedPrev.push(item.id)
        })
    }

    return (
        <>
            <View key={props.index} style={{ width: '98%', flexDirection: "row", alignItems: 'center', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', overflow: 'hidden', width: props.showInputs ? '45%' : '90%' }}>
                    <CheckBox
                        checked={props.isSelected}
                        onPress={props.onCheckPress}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../assets/unchecked.png")} />}
                    />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: props.showInputs ? '50%' : '100%' }}>{props.item.name}</Text>
                </View>

                {props.showInputs && <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'flex-end' }}>
                    <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                        <TextInputMask
                            onChangeText={(formatted, extracted) => {
                                props.setText("time_duration_h", extracted, props.index, props.serviceItem)
                            }}
                            mask={"[00]"}
                            color="black"
                            placeholder="HH"
                            keyboardType="numeric"
                            editable={props.isSelected}
                            style={styles.inputStyle}
                            value={props.serviceItem?.time_duration_h}
                            ref={hourRef}
                            // returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            returnKeyType={'done'}
                            // onSubmitEditing={() => minRef.current.focus()}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                        <TextInputMask
                            onChangeText={(formatted, extracted) => {
                                props.setText("time_duration_m", extracted, props.index, props.serviceItem)
                            }}
                            mask={"[00]"}
                            color="black"
                            placeholder="MM"
                            keyboardType="numeric"
                            editable={props.isSelected}
                            style={styles.inputStyle}
                            value={props.serviceItem?.time_duration_m}
                            ref={minRef}
                            // returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            // onSubmitEditing={() => priceRef.current.focus()}
                            returnKeyType={'done'}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={styles.fromContainer}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={props.isSelected}
                            onChangeText={(text) => props.setText("price", text, props.index, props.serviceItem)}
                            keyboardType="numeric"
                            value={props.serviceItem?.price}
                            ref={priceRef}
                            numberOfLines={1}
                            // returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            returnKeyType={'done'}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                </View>}
            </View>
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{}} showsVerticalScrollIndicator={false}> */}
            {/* <Content showsVerticalScrollIndicator={false}> */}
            {props.showInputs && props.products.map((item, index) => {
                return <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <CheckBox
                            checked={props.selectedProducts.includes(item.id)}
                            onPress={() => props.onPressProduct(item)}
                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                        />
                        <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%' }}>{item.name}</Text>
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '8%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={props.selectedProducts.includes(item.id)}
                            onChangeText={(text) => props.setProductText(item, text)}
                            keyboardType="numeric"
                            value={item.price}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                </View>
            })}
            {props.showInputs && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                    <CheckBox
                        checked={props.isOtherSelected}
                        onPress={() => props.onSelectOther()}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                    />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Other</Text>
                </View>
            </View>}
            {props.showInputs && props.isOtherSelected && props.newProducts.map((item, index) => {
                return <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <CheckBox
                            checked={props.selectedNewProducts.includes(item.temp_id)}
                            onPress={() => props.onPressNewProduct(item)}
                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '2.5%', width: '40%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="Product name"
                            editable={props.selectedNewProducts.includes(item.temp_id)}
                            onChangeText={(text) => props.setNewProductText(item, text, "name")}
                            value={item.name}
                            ref={nameRef}
                            returnKeyType={"default"}
                            // onSubmitEditing={() => priceNewRef.current.focus()}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '2%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={props.selectedNewProducts.includes(item.temp_id)}
                            onChangeText={(text) => props.setNewProductText(item, text, "price")}
                            keyboardType="numeric"
                            value={item.price}
                            ref={priceNewRef}
                            returnKeyType={'done'}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <TouchableOpacity onPress={() => props.removeNewproduct(item)} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, padding: 10, marginRight: '2%' }}>
                        <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                    </TouchableOpacity>
                </View>
            })}
            {props.showInputs && props.isOtherSelected && <View style={{ width: '85%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <TouchableOpacity onPress={() => props.addNewProduct()} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, marginRight: '8%', padding: 5 }}>
                    <Image source={require('../assets/addgreen.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
            </View>}
            {/* </Content> */}
            {/* </ScrollView>
            </KeyboardAvoidingView> */}
        </>
    )
})

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