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

const CancelModal = props => {
    const [search, setSearch] = useState('');
    return (
        <Modal
            visible={props.visible}
            animationType="fade"
            transparent={true}
            {...props}>
            <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
                <View
                    style={{
                        height: "50%",
                        backgroundColor: 'white',
                        width: "80%",
                        borderRadius: 10,
                        padding: 20,
                    }}>
                    <Container style={{ flex: 1, backgroundColor: 'white' }}>
                        <Content>
                            <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, alignSelf: "center", marginTop: "4%", color: 'black' }}>{props.title}</Text>
                            <View style={{ height: 2, width: 42, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
                            <Card style={{ marginTop: '15%' }}>
                                <TextInput
                                    multiline={true}
                                    style={{ padding: 10, height: 100, color: "black", fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlignVertical: 'top' }}
                                    placeholder="Write your message here..."
                                    value={props.value}
                                    onChangeText={props.onChangeText}
                                    placeholderTextColor={"black"}
                                />
                            </Card>
                            <View style={{flexDirection:"row",width:"100%"}}>
                            <TouchableOpacity
                                style={styles.save}
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.action1()
                                }}>
                                <Text style={styles.saveText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.save,{marginLeft:10}]}
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.action()
                                }}>
                                <Text style={styles.saveText}>Submit</Text>
                            </TouchableOpacity>
                            </View>
                        </Content>
                    </Container>
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
        justifyContent:"center"
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
        flex:1,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        marginTop:10,
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

export default CancelModal;