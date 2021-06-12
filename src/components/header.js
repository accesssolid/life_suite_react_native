import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Touchable, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import LS_FONTS from '../constants/fonts';

const Header = (props) => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.leftView}
                onPress={props.action}
                activeOpacity={0.7}
            >
                <Image
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                    source={require("../assets/back.png")}
                />
            </TouchableOpacity>
          
                <View style={styles.middleView}>
                    <Text style={styles.title}>{props.title}</Text>
                </View>
            
            <TouchableOpacity style={styles.rightView}
                onPress={props.action1}
                activeOpacity={0.7}
            >
                <Image
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                    source={require("../assets/home.png")}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'space-between',
    },
    leftView: {
        left: 20,
        alignItems: 'center'
    },
    middleView: {
        alignItems: 'center',
    },
    rightView: {
        right: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.black,
        fontSize: 16,
        textTransform: 'uppercase'
    }
})
