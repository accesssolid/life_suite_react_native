import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';
import { Card, Container, Content } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import { DropDown } from '../components/dropDown';

const DelayModal = props => {
    const [search, setSearch] = useState('');
    const [delayTime,setDelayTime]=useState("")
    const [hour,setHour]=useState("0")
    const [minute,setMinute]=useState("0")
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
                        <ScrollView>
                    <Text  maxFontSizeMultiplier={1.5} style={styles.sure}>Delay Order</Text>
                    <View style={{ height: 2, width: 84, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
                    <Text  maxFontSizeMultiplier={1.5} style={{ ...styles.subtext, marginTop: "10%" }}>Enter delay time</Text>
                    <View style={{marginTop:10}}>
                        <View >
                            <DropDown
                               title="Hours"
                               item={[0,1,2,3,4,5,6,7,8,9,10,11,12]}
                               value={hour}
                               onChangeValue={(index, value) => { setHour(value) }}
                               handleTextValue={true}
                            
                            />
                        </View>
                        <View>
                            <DropDown
                               title="Minutes"
                               item={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]}
                               value={minute}
                               onChangeValue={(index, value) => { setMinute(value) }}
                               handleTextValue={true}
                            
                            />
                        </View>
                        {/* <TextInput 
                            value={delayTime}
                            onChangeText={t=>setDelayTime(t)}
                            keyboardType="numeric"
                            maxFontSizeMultiplier={1.5}
                            placeholder="Minute"
                            placeholderTextColor={LS_COLORS.global.black}
                            style={{borderWidth:1,borderColor:LS_COLORS.global.green,color:"black",height:50,paddingHorizontal:10,fontFamily:LS_FONTS.PoppinsRegular,borderRadius:5}}
                        /> */}
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                if(Number(minute)>0||Number(hour)>0){
                                    const totaldelay=Number(minute)+Number(hour)*60
                                    props.submit(totaldelay)
                                 }
                            }}
                        >
                            <Text  maxFontSizeMultiplier={1.5} style={styles.saveText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.save, { marginTop: 20 }]}
                            activeOpacity={0.7}
                            onPress={() => {
                                props.pressHandler()
                            }}
                        >
                            <Text  maxFontSizeMultiplier={1.5} style={styles.saveText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
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
