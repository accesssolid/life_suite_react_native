import React, { useEffect, useRef, useState, useImperativeHandle, useReducer } from 'react';
import { View, StyleSheet, Text, Platform, Image, TouchableOpacity, KeyboardAvoidingView ,TextInput} from 'react-native';

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';

/* Packages */
import { CheckBox } from 'react-native-elements';
import TextInputMask from 'react-native-text-input-mask';

/* Components */;

import _ from 'lodash';

const ServiceItem = React.forwardRef((props, ref) => {
    const priceRef = useRef(null)
    const hourRef = useRef(null)
    const minRef = useRef(null)
    const nameRef = useRef(null)
    const priceNewRef = useRef(null)

    // from #liahs data check for the service item


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
                <View style={{
                    flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", overflow: 'hidden',
                    // width: props.showInputs ? '45%' : '90%'
                    flex: 1
                }}>
                    <CheckBox
                        checked={props.isSelected ?? false}
                        onPress={props.onCheckPress}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../assets/unchecked.png")} />}
                        containerStyle={{ marginRight: 0 }}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={{
                        fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium,
                        flex: 1
                    }}>{props.item.name}</Text>
                </View>

                {props.showInputs && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end' }}>
                    <View style={{ alignItems: "center", marginRight: 10 }}>
                        <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", marginBottom: 5, fontSize: 11, fontFamily: LS_FONTS.PoppinsRegular }}>Hour</Text>
                        <View style={{ ...styles.fromContainer }}>
                            {/* <TextInputMask
                                onChangeText={(formatted, extracted) => {
                                    if(extracted?.trim()==""){
                                        props.setText("time_duration_h", "", props.index, props.serviceItem)

                                    }else{
                                        props.setText("time_duration_h", extracted, props.index, props.serviceItem)

                                    }
                                }}
                                mask={"[00]"}
                                color="black"
                                placeholder="HH"
                                keyboardType="numeric"
                                textAlign='left'
                                editable={props.isSelected}
                                style={styles.inputStyle}
                                value={props?.serviceItem?.time_duration_h}
                                ref={hourRef}
                                //  selection={Platform.OS=="android"?undefined:{end:props.serviceItem?.time_duration_h?.length??0,start:props.serviceItem?.time_duration_h?.length??0}}
                                returnKeyType={'done'}
                                // selection={null} 
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                            /> */}
                            {/* <TextInput
                                onChangeText={(formatted, extracted) => {
                                    console.log();
                                    if(extracted?.trim()==""){
                                        props.setText("time_duration_h", "", props.index, props.serviceItem)

                                    }else{
                                        props.setText("time_duration_h", extracted, props.index, props.serviceItem)

                                    }
                                }}
                                // mask={"[00]"}
                                color="black"
                                placeholder="HH"
                                keyboardType="numeric"
                                textAlign='left'
                                editable={props.isSelected}
                                style={styles.inputStyle}
                                value={props?.serviceItem?.time_duration_h}
                                ref={hourRef}
                                //  selection={Platform.OS=="android"?undefined:{end:props.serviceItem?.time_duration_h?.length??0,start:props.serviceItem?.time_duration_h?.length??0}}
                                returnKeyType={'done'}
                                // selection={null} 
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                            /> */}
                            <TextInput
                                style={{minWidth:25,alignItems:'center',justifyContent:'center'}}
                                color="black"
                                placeholder="HH"
                                textAlign='left'
                                editable={props.isSelected}
                                maxLength={2}
                                // onChangeText={(text) => props.setText("time_duration_h", "", props.index, props.serviceItem)}
                                onChangeText={(text) => props.setText("time_duration_h", text, props.index, props.serviceItem)}
                                keyboardType="numeric"
                                value={props?.serviceItem?.time_duration_h}
                                ref={hourRef}
                                // selection={{end:props.serviceItem?.price?.length??0,start:props.serviceItem?.price?.length??0}}
                                numberOfLines={1}
                                returnKeyType={'done'}
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                            />
                        </View>
                    </View>
                    <View style={{ alignItems: "center", marginRight: 10 }}>
                        <Text maxFontSizeMultiplier={1.2} numberOfLines={1.} style={{ textAlign: "center", marginBottom: 5, fontSize: 11, fontFamily: LS_FONTS.PoppinsRegular }}>Minutes</Text>
                        <View style={{ ...styles.fromContainer }}>
                            {/* <TextInputMask
                                onChangeText={(formatted, extracted) => {
                                    if(extracted?.trim()==""){
                                        props.setText("time_duration_m", "", props.index, props.serviceItem)

                                    }else{
                                        props.setText("time_duration_m", extracted, props.index, props.serviceItem)

                                    }
                                }}
                                mask={"[00]"}
                                color="black"
                                placeholder="MM"
                                keyboardType="numeric"
                                textAlign='left'
                                editable={props.isSelected}
                                style={styles.inputStyle}
                                value={props?.serviceItem?.time_duration_m}
                                ref={minRef}
                                // selection={Platform.OS=="android"?undefined:{end:props.serviceItem?.time_duration_m?.length??0,start:props.serviceItem?.time_duration_m?.length??0}}
                                returnKeyType={'done'}
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                                rightToLeft={false}
                            /> */}
                            <TextInput
                                style={{minWidth:25,alignItems:'center',justifyContent:'center'}}
                                color="black"
                                placeholder="MM"
                                textAlign='left'
                                editable={props.isSelected}
                                maxLength={2}
                                // onChangeText={(text) => props.setText("time_duration_h", "", props.index, props.serviceItem)}
                                onChangeText={(text) => props.setText("time_duration_m", text, props.index, props.serviceItem)}
                                keyboardType="numeric"
                                value={props?.serviceItem?.time_duration_m}
                                ref={hourRef}
                                // selection={{end:props.serviceItem?.price?.length??0,start:props.serviceItem?.price?.length??0}}
                                numberOfLines={1}
                                returnKeyType={'done'}
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                            />
                        </View>
                    </View>
                    <View style={{ marginRight: 5 }}>
                        <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", color: "white", marginBottom: 5, fontSize: 11, fontFamily: LS_FONTS.PoppinsRegular }}>dd</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={[styles.inputStyle,{minWidth:40}]}
                                color="black"
                                placeholder="$000"
                                textAlign="left"
                                editable={props.isSelected}
                                onChangeText={(text) => props.setText("price", text, props.index, props.serviceItem)}

                                keyboardType="numeric"
                                value={props.serviceItem?.price}
                                ref={priceRef}
                                // selection={{end:props.serviceItem?.price?.length??0,start:props.serviceItem?.price?.length??0}}
                                numberOfLines={1}
                                returnKeyType={'done'}
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                maxFontSizeMultiplier={1.2}
                            />
                        </View>
                    </View>
                </View>}
            </View>
            {props.showInputs && props.products.map((item, index) => {
                return <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <CheckBox
                            checked={props.selectedProducts.includes(item.id)}
                            onPress={() => props.onPressProduct(item)}
                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                        />
                        <Text maxFontSizeMultiplier={1.2} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%' }}>{item.name}</Text>
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: 10 }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$00"
                            textAlign='left'
                            editable={props.selectedProducts.includes(item.id)}
                            onChangeText={(text) => props.setProductText(item, text)}
                            keyboardType="numeric"
                            value={item.price}
                            // selection={{end:item.price?.length??0,start:item.price?.length??0}}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                            maxFontSizeMultiplier={1.2}
                        />
                    </View>
                    {item.list_type == "private" &&
                        <TouchableOpacity onPress={() => {
                            if (props.removeNonGlobalItem) {
                                props.removeNonGlobalItem(item.id)
                            }
                        }} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, padding: 10, }}>
                            <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                        </TouchableOpacity>
                    }
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
                    <Text maxFontSizeMultiplier={1.2} numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Other</Text>
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
                            textAlign="right"
                            ref={nameRef}
                            returnKeyType={"default"}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                            maxFontSizeMultiplier={1.2}
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
                            textAlign='right'
                            value={item.price}
                            selection={{end:item.price?.length??0,start:item.price?.length??0}}
                            ref={priceNewRef}
                            returnKeyType={'done'}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                            maxFontSizeMultiplier={1.2}
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
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
})