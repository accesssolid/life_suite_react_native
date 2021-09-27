import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { Card } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import moment from 'moment';

const TimeFrame = props => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false)
    const [toTime, setToTime] = useState(new Date())
    const [fromTime, setFromTime] = useState(new Date())

    const handleConfirm = (date) => {
        setToTime(date)
    };
    const handleConfirm1 = (date) => {
        setFromTime(date)
    };
    
    return (
        <Modal
            visible={props.visible}
            animationType="fade"
            {...props}
        >
            <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
                <Card style={{
                        backgroundColor: 'white',
                        width: "80%",
                        borderRadius: 10,
                        padding: 20,
                    }}>
                    <Text style={{ textAlign: "center", color: LS_COLORS.global.green, fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 10 }}>Select Time Frame</Text>
                    <View style={{ marginTop: "10%" }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>({props.serviceData[0]?.service_name})</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", marginTop: "5%" }}>
                            <View style={{ width: "50%", height: 50, }} >
                                <Text>From</Text>
                                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                    <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} onPress={() => setDatePickerVisibility1(!isDatePickerVisible1)}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(fromTime).format("hh : mm A")}</Text>
                                        <View style={{ height: 11, aspectRatio: 1 }}>
                                            <Image source={require('../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: "50%", height: 50, justifyContent: 'center' }}>
                                <Text>To</Text>
                                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                    <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(toTime).format("hh:mm A")}</Text>
                                        <View style={{ height: 11, aspectRatio: 1 }}>
                                            <Image source={require('../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: '20%' }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={props.action}>
                            <Text style={styles.saveText}>Send Request</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
                <DateTimePickerModal
                    date={new Date()}
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                <DateTimePickerModal
                    date={new Date()}
                    isVisible={isDatePickerVisible1}
                    mode="time"
                    onConfirm={handleConfirm1}
                    onCancel={() => setDatePickerVisibility1(false)}
                />
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        alignItems: 'center',
        paddingTop: '40%'
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
        height: 45,
        paddingHorizontal: "10%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    },

});

export default TimeFrame;
