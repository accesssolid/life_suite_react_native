import React, { useState, Fragment } from 'react';
import { View, StyleSheet, Text, Modal, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import { globalStyles } from '../utils';
import LS_FONTS from '../constants/fonts';

import DropDownPicker from 'react-native-dropdown-picker';


const DropDown = (props) => {
    return (
        <DropDownPicker
            open={props.isOpen}
            value={props.value}
            setOpen={props.setOpen}
            setValue={props.setValue}
            items={props.item}
            zIndex={props.zIndex}
            style={{ backgroundColor: LS_COLORS.global.white, borderColor: "#C7C7C7", borderRadius: 5 }}
            itemStyle={{
                justifyContent: 'flex-start',
                fontFamily: LS_FONTS.PoppinsRegular,
                fontSize: 12,
                paddingLeft: 5,
                backgroundColor: LS_COLORS.global.black
            }}
            activeLabelStyle={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.white }}
            labelStyle={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, color: LS_COLORS.global.black }}
            dropDownMaxHeight={300}
            placeholderStyle={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, }}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            dropDownStyle={{ backgroundColor: LS_COLORS.global.black, borderColor: LS_COLORS.global.cyan }}
            arrowSize={20}
            arrowColor={LS_COLORS.global.white}
            onOpen={props.onOpen}
            onChangeValue={props.onChangeValue}
        />
    )
}
export default DropDown