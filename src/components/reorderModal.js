import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native';
import { Card, Container, Content } from 'native-base';

import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import CustomButton from './customButton';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showToast } from '../components/validators';

const ReorderModal = ({ visible, setVisible, title, onPressYes }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [date,setDate]=useState(moment().toDate())
    const [startTime, setStartTime] = useState(moment().toDate())
    const [endTime, setEndTime] = useState(moment().toDate())

    const handleConfirm2 = (date) => {
        setDate(date)
        setDatePickerVisibility2(false);
    };

    const handleConfirm = (date) => {
        setStartTime(date)
        setDatePickerVisibility(false);
    };

    const handleConfirm1 = (date) => {
        if (moment(date).toDate() > moment(startTime).toDate()) {
            setEndTime(date)
        } else {
            showToast("End time must be greater than start time.")
        }
        setDatePickerVisibility1(false);

    };

    React.useEffect(() => {
        if (!visible) {
            setDatePickerVisibility(false)
            setDatePickerVisibility1(false)
            setDatePickerVisibility2(false)
        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            style={{ flex: 1 }}
        >
            <Pressable onPress={() => { setVisible(false) }} style={styles.modalScreen}>
                <Pressable
                    style={{
                        backgroundColor: 'white',
                        width: "80%",
                        borderRadius: 10,
                        padding: 20,
                    }}>
                    <Text  maxFontSizeMultiplier={1.5} style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, alignSelf: "center", marginTop: "4%", color: 'black' }}>{title}</Text>
                    <View style={{ height: 2, width: 42, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
                    <Text  maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>Select Date</Text>

                        <TouchableOpacity
                            style={{ padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.grey }}
                            activeOpacity={0.7}
                            onPress={() => {
                                setDatePickerVisibility2(true)
                            }} >
                            <Text  maxFontSizeMultiplier={1.5} style={{color:"black"}}>{moment(date).format('MM-DD-YYYY')}</Text>
                        </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around" ,marginTop:10}}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text  maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>Start Time</Text>
                            <TouchableOpacity
                                style={{ padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.grey }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setDatePickerVisibility(true)
                                    setDatePickerVisibility1(false)
                                }} >
                                <Text  maxFontSizeMultiplier={1.5}>{moment(startTime).format('hh:mm A')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <Text  maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>End Time</Text>
                            <TouchableOpacity
                                style={{ padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.grey }}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setDatePickerVisibility1(true)
                                    setDatePickerVisibility(false)
                                }} >
                                <Text  maxFontSizeMultiplier={1.5}>{moment(endTime).format('hh:mm A')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 30 }}></View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="time"
                        date={moment(startTime).toDate()}
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible1}
                        mode="time"
                        date={moment(endTime).toDate()}
                        onConfirm={handleConfirm1}
                        onCancel={() => setDatePickerVisibility1(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible2}
                        mode="date"
                        date={moment(date).toDate()}
                        onConfirm={handleConfirm2}
                        onCancel={() => setDatePickerVisibility2(false)}
                    />
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                setVisible(false)
                            }}>
                            <Text  maxFontSizeMultiplier={1.5} style={styles.saveText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.save, { marginLeft: 10 }]}
                            activeOpacity={0.7}
                            onPress={() => {
                                if(startTime<endTime){
                                    onPressYes(moment(date).format("YYYY-MM-DD ")+moment(startTime).format("HH:mm:[00]"),moment(date).format("YYYY-MM-DD ")+moment(endTime).format("HH:mm:[00]"))
                                    setVisible(false)
                                }
                            }}>
                            <Text  maxFontSizeMultiplier={1.5} style={styles.saveText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
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
        flex: 1,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        marginTop: "10%",
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

});

export default ReorderModal;
