import React, { useState, Fragment } from 'react';
import { View, StyleSheet, Text, Modal, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import { globalStyles } from '../utils';
import LS_FONTS from '../constants/fonts';

import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'


const DropDown = (props) => {
    return (
        <>
            {
                props.title
                    ?
                    <>
                        <Text style={styles.title}>{props.title}<Text style={{ color: "red" }}>{props.important && "*"}</Text></Text>
                    </>
                    :
                    null
            }
            <View style={[styles.container, props.containerStyle]}>
                <View style={styles.arrow}>
                    <AntDesign name="down" color={LS_COLORS.global.green} />
                </View>
                <ModalDropdown
                    ref={props.dropRef}
                    defaultValue={props.value}
                    isFullWidth={true}
                    options={props.item}
                    textStyle={{ fontSize: 14, height: 50, width: "100%", fontFamily: LS_FONTS.PoppinsRegular, paddingLeft: 20, textAlignVertical: "center", lineHeight: 50 }}
                    dropdownTextStyle={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.black }}
                    dropdownStyle={[{ borderWidth: 1 }, props.dropdownStyle]}
                    onSelect={props.onChangeValue}
                    showsVerticalScrollIndicator={false}
                    disabled={props.disabled}
                    renderRow={(item) => {
                        return (<View style={{ flexDirection: 'row',width:"100%", justifyContent: 'space-between', alignItems: 'center', height: 40, paddingHorizontal: '5%', backgroundColor: LS_COLORS.global.white }}>
                            <Text style={{ fontFamily: LS_FONTS.RalewayRegular, fontSize: 12 }}>{item}</Text>
                            {props.value == item && <AntDesign name="check" color={LS_COLORS.global.green} size={18} />}
                        </View>)
                    }}
                />
            </View>
        </>
    )
}
export default DropDown


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
        height: 52,
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
        right: 20,
        top: 20
    }
})