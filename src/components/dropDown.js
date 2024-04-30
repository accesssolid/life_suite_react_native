import React, { useState, Fragment } from 'react';
import { View, StyleSheet, Text, Modal, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import { globalStyles } from '../utils';
import LS_FONTS from '../constants/fonts';

import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown-v2';
import AntDesign from 'react-native-vector-icons/AntDesign'


const DropDown1 = (props) => {
    return (
        <>
            {
                props.title
                    ?
                    <>
                        <Text maxFontSizeMultiplier={1.5} style={styles.title}>{props.title}<Text style={{ color: "red" }}>{props.important && "*"}</Text></Text>
                    </>
                    :
                    null
            }
            <View style={[styles.container, props.containerStyle]}>
                <View style={styles.arrow}>
                    <AntDesign name="down" color={LS_COLORS.global.green} />
                </View>
                {props.handleTextValue &&
                <View style={{ left:"0%",
                position:"absolute",width:"100%",height:52,justifyContent:"center"}}>
                <Text  maxFontSizeMultiplier={1.2} numberOfLines={1} style={[{
                    fontSize: 14,
                    width: "80%",
                    fontFamily: LS_FONTS.PoppinsRegular,
                    paddingLeft: 20,
                    textAlignVertical: "center",
                   
                },props.handleTextValueStyle]} {...props.textValueProps}>{props.value}</Text>
                </View>
                }
                <ModalDropdown
                
                    ref={props.dropRef}
                    defaultValue={props.value}
                    isFullWidth={true}
                    options={props.item}
                    renderSeparator={()=>{
                        return(
                            <View style={{borderBottomWidth: 0.8 ,
                                borderColor:"gray"}}>
                                </View>
                        )
                    }}
                    textStyle={{
                        fontSize: props.handleTextValue ? 0 : 14,
                        height: 50,
                        width: "100%",
                        opacity: props.handleTextValue ? 0 :1,
                        fontFamily: LS_FONTS.PoppinsRegular,
                        paddingLeft: 20,
                        textAlignVertical: "center",
                        lineHeight: 50
                    }}
                    dropdownTextStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 12,
                        color: LS_COLORS.global.black
                    }}
                    dropdownStyle={[{ borderWidth: 1,marginTop:5 }, props.dropdownStyle,]}
                    onSelect={props.onChangeValue}
                    showsVerticalScrollIndicator={true}
                    disabled={props.disabled}
                    renderRow={(item) => {
                        return (<View style={{
                            flexDirection: 'row',
                            width: "100%",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height:40,
                            paddingHorizontal: '2%',
                            backgroundColor: LS_COLORS.global.white,
                        }}>
                            <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: LS_FONTS.RalewayRegular, fontSize: 12, textAlign: "left" }}>{item}</Text>
                            {props.value == item && <AntDesign name="check" color={LS_COLORS.global.green} size={18} />}
                        </View>)
                    }}
                />
            </View>
        </>
    )
}

export const DropDown = (props) => {
    return (
        <View style={[{position:"relative",borderWidth:1,marginBottom:30,marginHorizontal:10,borderColor:LS_COLORS.global.lightTextColor,borderRadius:7},props.containerStyle1]}>
            <View style={[styles.container,{marginHorizontal:0,marginBottom:0,borderWidth:0}, props.containerStyle]}>
                <View style={styles.arrow}>
                    <AntDesign name="down" color={LS_COLORS.global.green} />
                </View>
                {props.handleTextValue && 
                
                <Text maxFontSizeMultiplier={1.7} style={{
                    fontSize: 14,
                    minHeight: 50,
                    width: "100%",
                    fontFamily: LS_FONTS.PoppinsRegular,
                    paddingLeft: 20,
                    textAlignVertical: "center",
                    lineHeight: 40,
                    left:"0%",
                    position:"absolute",
                }}>{props.value}</Text>}
                <ModalDropdown
                    ref={props.dropRef}
                    defaultValue={props.value}
                    isFullWidth={true}
                    options={props.item}
                    renderSeparator={()=>{
                        return(
                            <View style={{borderBottomWidth: 0.8 ,
                                borderColor:"gray"}}>
                                </View>
                        )
                    }}
                    textStyle={{
                        fontSize: props.handleTextValue ? 0 : 14,
                        minHeight: 50,
                        width: "100%",
                        opacity: props.handleTextValue ? 0 :1,
                        fontFamily: LS_FONTS.PoppinsRegular,
                        paddingLeft: 10,
                        textAlignVertical: "center",
                        // lineHeight: 50
                        paddingVertical:5
                    }}
                    dropdownTextStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 12,
                        color: LS_COLORS.global.black,
                    }}
                    dropdownStyle={[{ borderWidth: 1 }, props.dropdownStyle]}
                    onSelect={props.onChangeValue}
                    showsVerticalScrollIndicator={true}
                    disabled={props.disabled}
                    renderRow={(item) => {
                        return (<View style={{
                            flexDirection: 'row',
                            width: "100%",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 40,
                            paddingHorizontal: '2%',
                            backgroundColor: LS_COLORS.global.white,
                        }}>
                            <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.RalewayRegular, fontSize: 12, textAlign: "left" }}>{item}</Text>
                            {props.value == item && <AntDesign name="check" color={LS_COLORS.global.green} size={18} />}
                        </View>)
                    }}
                />
            </View>
            {
                props.title
                    ?
                    <>
                        <Text maxFontSizeMultiplier={1.6} style={[styles.title,{fontSize:12,marginTop:0,color:LS_COLORS.global.lightTextColor,marginHorizontal:10,position:"absolute",fontFamily:LS_FONTS.PoppinsRegular,top:-10,backgroundColor:"white"}]}>{props.title}<Text style={{ color: "red" }}>{props.important && "*"}</Text></Text>
                    </>
                    :
                    null
            }
        </View>
    )
}

export default DropDown1


const styles = StyleSheet.create({
    textInputContainer: {
        width: '85%',
        paddingHorizontal: 24,
        fontFamily: LS_FONTS.RalewayRegular,
        fontSize: 14
    },
    container: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: LS_FONTS.customTextInputBorder,
        justifyContent: "center",
    },
    rightIcon: {
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: LS_FONTS.RalewayMedium,
        fontSize: 15,
        color: LS_COLORS.global.black,
        marginBottom: 12,
        marginHorizontal: '5%',
        marginTop: 20,
    },
    arrow: {
        position: "absolute",
        right: 10,
        top: 20
    }
})