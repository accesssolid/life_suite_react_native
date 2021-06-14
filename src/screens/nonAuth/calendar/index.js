import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { Container, Content } from "native-base";
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import CustomButton from "../../../components/customButton"

const Calendar = (props) => {

    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const onDateChange = (date) => {
        var a = moment(date).format("DD MMM")
        setSelectedStartDate(a)
    }
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>

            <Header
                title="Calendar"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.pop()
                }}

            />


            <View
                style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 18 }}>Add Date</Text>
                <View style={styles.calendar}>
                    <CalendarPicker
                        onDateChange={onDateChange}
                        previousTitle = "<"
                        nextTitle=">"
                        scaleFactor={375}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        monthYearHeaderWrapperStyle = {{
                            fontSize:18
                        }}
                        selectedDayColor = {LS_COLORS.global.green}
                        selectedDayTextColor = {LS_COLORS.global.white}
                        textStyle={{
                            fontFamily: LS_FONTS.PoppinsLight,
                            }}
                    />

                    <View>
                        <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>Date Added</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ height: 50, width: 50, marginTop: 10, backgroundColor: LS_COLORS.global.green, borderRadius: 100, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsBold, color: LS_COLORS.global.white }}>{startDate}</Text>
                            </View>
                            <Text style={{ alignSelf: 'center', fontSize: 14, fontFamily: LS_FONTS.PoppinsLight, marginLeft: 10 }}>Need a Mechanic</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.save}
                    activeOpacity={0.7}
                    onPress={() => {
                    }}
                >
                    <Text style={styles.saveText}>Confirm</Text>
                </TouchableOpacity>
                <View style={{ height: 30 }}></View>
            </View>

        </SafeAreaView>
    )
}

export default Calendar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    calendar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        top: '5%'
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})

