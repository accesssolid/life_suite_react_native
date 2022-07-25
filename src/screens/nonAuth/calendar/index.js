import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native'

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
    const { setDate, service } = props.route.params
    const [date, setDatee] = useState(moment(new Date().getTime()).format("DD MMM YYYY"))

    const onDateChange = (date) => {
        var a = moment(date).format("DD MMM YYYY")
        setDatee(a)
        setDate(a)
    }

    const confirm = () => {
        var a = moment(date).format("YYYY-MM-DD")
        setDatee(a)
        setDate(a)
        // props.navigation.goBack()
        props.navigation.navigate("MechanicLocation", { data: date })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Calendar"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}

            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}>
                <View
                    style={styles.container}>

                    <Text maxFontSizeMultiplier={1.5} style={{ textAlign: 'center', marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 18 }}>Add Date</Text>
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
                            minDate={new Date()}
                            selectedDayColor={LS_COLORS.global.green}
                            selectedDayTextColor={LS_COLORS.global.white}
                            textStyle={{
                                fontFamily: LS_FONTS.PoppinsLight,
                            }}
                        />

                        <View>
                            <Text maxFontSizeMultiplier={1.5} style={{ marginTop: 20, marginLeft: 20, fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>Date Added</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ height: 70, width: 70, backgroundColor: LS_COLORS.global.green, borderRadius: 100, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text maxFontSizeMultiplier={1.3} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsBold, color: LS_COLORS.global.white, textAlign: 'center' }}>{date}</Text>
                                </View>
                                <Text maxFontSizeMultiplier={1.5} style={{ alignSelf: 'center', fontSize: 14, fontFamily: LS_FONTS.PoppinsLight, marginLeft: 10 }}>Need a {service}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.save}
                                onPress={() => confirm()}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ScrollView>
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
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})

