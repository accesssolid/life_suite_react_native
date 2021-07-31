import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content, Row, } from 'native-base'

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import CustomButton from "../../../components/customButton"

const Calendar = (props) => {
    const { setDate } = props.route.params
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const [date,setDatee] = useState(null)
    const onDateChange = (date) => {
        setDatee(date)
        var a = moment(date).format("DD MMM YYYY")
        setSelectedStartDate(a)
        setDate(a)
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
                        previousTitle="<"
                        nextTitle=">"
                        scaleFactor={375}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        monthYearHeaderWrapperStyle={{
                            fontSize: 18
                        }}
                        selectedDayColor={LS_COLORS.global.green}
                        selectedDayTextColor={LS_COLORS.global.white}
                        textStyle={{
                            fontFamily: LS_FONTS.PoppinsLight,
                        }}
                    />

                    <View>
                        <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>Date Added</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ height: 50, width: 50, marginTop: 10, backgroundColor: LS_COLORS.global.green, borderRadius: 100, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsBold, color: LS_COLORS.global.white, textAlign:'center' }}>{startDate}</Text>
                            </View>
                            <Text style={{ alignSelf: 'center', fontSize: 14, fontFamily: LS_FONTS.PoppinsLight, marginLeft: 10 }}>Need a Mechanic</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.save}
                            onPress={() => {
                                props.navigation.navigate("MechanicLocation",{ "date": date })
                            }}
                        >
                            <Text style={styles.saveText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        marginTop: 50
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})

