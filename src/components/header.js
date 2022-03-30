import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Pressable, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import LS_FONTS from '../constants/fonts';

const Header = (props) => {
    const dispatch = useDispatch()

    return (
        <View style={[styles.container,props.containerStyle,{alignItems:"center"}]}>
            <Pressable style={styles.leftView}
                onPress={props.action}
                activeOpacity={0.7}>
                <Image
                    style={[{ height: '80%', width: '80%', resizeMode: 'contain' ,tintColor:"white"},props.imageStyle]}
                    source={props.imageUrl}
                />
            </Pressable>
            <View style={styles.middleView}>
                <Text maxFontSizeMultiplier={1.6} style={[styles.title, props.titleStyle,{color:"white"}]}>{props.title}</Text>
            </View>
            <Pressable style={styles.rightView}
                onPress={()=>{
                    if(props.action1){
                        console.log(props.action1)
                        props.action1()
                    }else{
                      
                    }
                }}
                activeOpacity={0.7}>
                <Image
                    style={[{ height: 25, width: 25, resizeMode: 'contain', tintColor: "white" }, props.imageStyle1]}
                    source={props.imageUrl1}
                />
            </Pressable>
        </View>
    )
}

export function ChatHeader(props) {
    return (
        <View style={styles.container}>
            <Pressable style={styles.leftView}
                onPress={props.action}
                activeOpacity={0.7}>
                <Image
                    style={{ height: '80%', width: '80%', resizeMode: 'contain' ,tintColor:"white"}}
                    source={props.imageUrl}
                />
            </Pressable>
            <View style={[styles.middleView, { flexDirection: "row" ,justifyContent:"center",alignItems:"center"}]}>
                <Text  maxFontSizeMultiplier={1.7} style={[styles.title, props.titleStyle,{color:"white"}]}>{props.title}</Text>
                {props.show_i&&<Pressable onPress={()=>{
                    if(props?.showList){
                        props.showList()
                    }
                }} style={{ borderWidth: 1,borderColor:"white", height: 20, borderRadius: 50,marginLeft:5, width: 20, justifyContent: "center", alignItems: "center" }}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.title,{fontSize:12,textTransform:"lowercase",color:"white"}]}>i</Text>
                </Pressable>}
            </View>
            <Pressable style={styles.rightView}
                onPress={props.action1}
                activeOpacity={0.7}>
                <Image
                    style={[{ height: 25, width: 25, resizeMode: 'contain', tintColor: "white" }, props.imageStyle1]}
                    source={props.imageUrl1}
                />
            </Pressable>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'space-between',
        zIndex: 500,
    },
    leftView: {
        left: 20,
        padding:5,
        aspectRatio: 1,
        alignItems: 'center',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    middleView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightView: {
        right: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.darkBlack,
        fontSize: 16,
        textTransform: 'uppercase'
    }
})
