
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StatusBar,
    Text,
    useColorScheme,
    View,
    NativeModules,
    Platform,
    TextInput,
    BackHandler,
    Dimensions,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import { Icon, Container, Content } from 'native-base'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header';
import CustomButton from '../../../components/customButton';

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
            props.navigation.navigate('ConfirmSetPasscode', { pass: Passcode })
        }
        else {
            Alert.alert('Passcode length must be greater than 3 digits')
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    imageUrl={require("../../../assets/back.png")}
                    action={() => props.navigation.pop()}
                    imageUrl1={require("../../../assets/home.png")}
                    action1={() => props.navigation.navigate("HomeScreen")}
                    title="Set Passcode"
                />
                <Container>
                    <Content keyboardShouldPersistTaps={'never'} keyboardDismissMode={false}>

                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text style={{ width: '80%', alignSelf: 'center', marginVertical: 5 }}>New Passcode</Text>
                            <View style={{ backgroundColor: "#F6F6F6", width: "80%", height: 50 }}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{ flex: 1, paddingHorizontal: 10, textAlign: 'left' }}
                                    keyboardType={'number-pad'}
                                    keyboardAppearance={'dark'}
                                    returnKeyType={'default'}
                                    enablesReturnKeyAutomatically={true}
                                    value={Passcode}
                                    placeholder={'Enter New Passcode'}
                                    // placeholderTextColor={AppColors.title_grey}
                                    onChangeText={(i) => setPasscode(i)}
                                />
                            </View>
                            <View style={{ height: 30 }} />
                            <CustomButton onPress={() => confirmPassCode()} title={'Set Passcode'} />
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        </>
    );
};


export default SetPassCode;
