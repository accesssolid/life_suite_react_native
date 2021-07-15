import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, Text } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Container, Content, Card } from 'native-base';
import SureModal from '../../../components/sureModal';
const DeclineConfirmation = (props) => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <SureModal
                pressHandler={() => {
                    setOpen(!open);
                }}
                visible={open}
                action1={() => props.navigation.navigate("OrderHistory")}
                action1={() => {
                    setOpen(!open);
                }}
            />
            <Header
                title="DECLINE CONFIRMATION"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.pop()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <Content>
                    <View style={styles.imageView}>
                        <Image
                            style={styles.image}
                            source={require("../../../assets/man.png")}
                        />
                    </View>
                    <Card style={styles.desp}>
                        <View style={styles.textView}>
                            <Text style={styles.mainText}>SP1</Text>
                            <Text style={styles.subText}>Task 1</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.subText}>Job</Text>
                            <Text style={styles.subText}>Mechanic</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.subText}>Price</Text>
                            <Text style={styles.subText}>$ 15</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.subText}>Date:</Text>
                            <Text style={styles.subText}>2/2/2021</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.subText}>Time</Text>
                            <Text style={styles.subText}>10.00 am</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.subText}>Rating</Text>
                            <Text style={styles.subText}>*****</Text>
                        </View>
                    </Card>
                    <View style={styles.remainingView}>
                        <Text style={styles.remaining}>You have 3 remaining</Text>
                        <Text style={styles.remaining}>Cancel/Decline orders</Text>
                    </View>
                    <View style={styles.buttonOverView}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                props.navigation.navigate("OrderHistory1")
                            }}
                        >
                            <Text style={styles.saveText}>Keep Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                setOpen(!open);
                            }}
                        >
                            <Text style={styles.saveText}>Yes,Decline</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        </SafeAreaView>
    )
}

export default DeclineConfirmation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    imageView: {
        paddingVertical: '6%',
        alignSelf: "center"
    },
    image: {
        height: 136,
        width: 136,
        resizeMode: 'contain'
    },
    desp: {
        maxHeight: '100%',
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
    },
    textView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: "6%"
    },
    mainText: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black"
    },
    subText: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black"
    },
    remainingView: {
        marginTop: "15%"
    },
    remaining: {
        fontSize: 14,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        textAlign: 'center',
    },
    buttonOverView: {
        width: '65%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 18,
        alignSelf: 'center',
        marginTop: "15%"
    },

    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
})
