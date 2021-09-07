import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const SmallCards = props => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={props.action}
            style={styles.mainView}>
            <View style={{ height: '75%', width: '100%', overflow: 'hidden'}}>
                <Image
                    style={styles.room}
                    source={props.imageUrl}
                    resizeMode="cover"
                />
            </View>
            <View style={{height:"25%" ,justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',alignContent:'center' }}>
                <Text style={styles.text}>{props.title1}</Text>
                <TouchableOpacity style = {{height:50,width:23,justifyContent:"center",alignItems:"center",right:3}} onPress={props.favorite}>
                    {props.favStatus == 1 ?
                        <Image
                            style={{ height: 20, width: 22,resizeMode:'contain' }}
                            source={require('../assets/heartGreen.png')}
                            resizeMode="cover"
                        />
                        :
                        <Image
                            style={{ height: 20, width: 23, }}
                            source={require('../assets/whiteHeart.png')}
                            resizeMode="cover"
                        />
                    }

                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainView: {
        aspectRatio: 1,
        width: '30%',
        elevation: 5,
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        backgroundColor: LS_COLORS.global.white,
        marginBottom: 20,
        margin: '1%'
    },
    text: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: LS_FONTS.PoppinsMedium,
        left: 3
    },
    room: {
        height: '100%',
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
})

export default SmallCards