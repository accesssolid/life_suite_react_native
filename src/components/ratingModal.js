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
import { Rating } from 'react-native-ratings';

const RatingModal = ({ visible, data, setVisible, title, onPressYes }) => {
    const [search, setSearch] = useState('');
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            style={{ flex: 1 }}
        >
            <Pressable onPress={() => { setVisible(false) }} style={styles.modalScreen}>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: "80%",
                        borderRadius: 10,
                        padding: 20,
                    }}>
                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, alignSelf: "center", marginTop: "4%", color: 'black' }}>Feedback</Text>
                    <View style={{ height: 2, width: 42, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "black" }]}>Rating:  </Text>
                        <Rating
                            readonly={true}
                            imageSize={20}
                            type="custom"
                            ratingBackgroundColor="white"
                            ratingColor="#04BFBF"
                            tintColor="white"
                            startingValue={data?.rating ?? "0"}
                        />
                    </View>
                    {data?.tip&&<View style={{ flexDirection: "row", marginVertical: 10, alignItems: "center", justifyContent: "space-between" }} >
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "black" }]}>Tip:  </Text>
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.saveText, { color:LS_COLORS.global.green, fontSize: 14 }]}>${data?.tip ?? "0"}</Text>
                    </View>}
                    {data?.comment&&<View style={{}} >
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "black", textAlign: "justify" }]}>Comment:  </Text>
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "gray", fontSize: 14, textAlign: "justify" }]}>{data?.comment}</Text>
                    </View>}
                    <View style={{ flexDirection: "row", width: "100%" }}>
                    </View>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.save1}>
                        <Text  maxFontSizeMultiplier={1.5} style={styles.saveText1}>Done</Text>
                    </TouchableOpacity>
                </View>
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

export default RatingModal;
