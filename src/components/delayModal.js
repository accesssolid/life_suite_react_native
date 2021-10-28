import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';
import { Card, Container, Content } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';

const DelayModal = props => {
    const [search, setSearch] = useState('');
    const [delayTime,setDelayTime]=useState("")

    const navigation = useNavigation()
    return (
        <Modal
            visible={props?.open}
            animationType="fade"
            transparent={true}
            {...props}>
            <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
                <Pressable
                    style={{
                        backgroundColor: 'white',
                        width: 327,
                        borderRadius: 10,
                        padding: 20,
                    }}>
                    <Text style={styles.sure}>Delay Order</Text>
                    <View style={{ height: 2, width: 84, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
                    <Text style={{ ...styles.subtext, marginTop: "10%" }}>Enter delay time in minutes? </Text>
                    <View style={{marginTop:10}}>
                        <TextInput 
                            value={delayTime}
                            onChangeText={t=>setDelayTime(t)}
                            keyboardType="numeric"
                            placeholder="minute"
                            placeholderTextColor={LS_COLORS.global.black}
                            style={{borderWidth:1,borderColor:LS_COLORS.global.black,fontFamily:LS_FONTS.PoppinsRegular,borderRadius:5}}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                if(delayTime!=""&&Number(delayTime)){
                                    props.submit(Number(delayTime))
                                 }
                            }}
                        >
                            <Text style={styles.saveText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.save, { marginTop: 20 }]}
                            activeOpacity={0.7}
                            onPress={() => {
                                props.pressHandler()
                            }}
                        >
                            <Text style={styles.saveText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        paddingTop: '50%'
    },

    searchBar: {
        height: 48,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    searchIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    textInput: {
        color: 'black',
        fontFamily: LS_FONTS.PoppinsMedium,
        width: '90%',
        marginLeft: 5,
    },
    sure: {
        color: 'black',
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        textAlign: "center"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 50,
        width: 238,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: "15%"
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    },
    saveText1: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    save1: {
        justifyContent: "center",
        alignItems: 'center',
        height: 50,
        width: 238,
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 100,
        borderColor: LS_COLORS.global.green,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 20
    },
    subtext: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: "black",
        alignSelf: 'center'
    }
});

export default DelayModal;
