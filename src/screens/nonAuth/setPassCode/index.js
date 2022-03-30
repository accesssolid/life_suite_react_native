
import React, { useState } from 'react';
import {
    Alert,
    Text,
    View,
    TextInput,
    BackHandler,
} from 'react-native';
import { Icon, Container, Content } from 'native-base'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header';
import CustomButton from '../../../components/customButton';
import LS_COLORS from '../../../constants/colors';

const SetPassCode = (props) => {
    const [Passcode, setPasscode] = useState('')

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                props.navigation.goBack()
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
        }, [])
    );

    const confirmPassCode = async () => {
        if (Passcode.length >= 4) {
            props.navigation.navigate('ConfirmSetPassCode', { pass: Passcode })
        }
        else {
            Alert.alert('Passcode length must be greater than 3 digits')
        }
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: LS_COLORS.global.green }}>
                <Header
                    imageUrl={require("../../../assets/back.png")}
                    action={() => props.navigation.goBack()}
                    imageUrl1={require("../../../assets/home.png")}
                    action1={() => props.navigation.navigate("MainDrawer",{screen:"HomeScreen"})}
                    containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

                    title="Set Passcode"
                />
                <Container>
                    <Content keyboardShouldPersistTaps={'never'} keyboardDismissMode={false}>

                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text style={{ width: '80%', alignSelf: 'center', marginVertical: 5 }}>New Passcode</Text>
                            <View style={{ backgroundColor: "#F6F6F6", width: "80%", height: 50 }}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{ flex: 1, paddingHorizontal: 10,color:"black", textAlign: 'left' }}
                                    keyboardType={'number-pad'}
                                    keyboardAppearance={'dark'}
                                    returnKeyType={'default'}
                                    enablesReturnKeyAutomatically={true}
                                    value={Passcode}
                                    placeholder={'Enter New Passcode'}
                                    
                                    placeholderTextColor={LS_COLORS.global.grey}
                                    onChangeText={(i) => setPasscode(i)}
                                />
                            </View>
                            <View style={{ height: 30 }} />
                            <CustomButton action={() => confirmPassCode()} title={'Set Passcode'} />
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        </>
    );
};


export default SetPassCode;
