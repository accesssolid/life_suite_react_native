
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

const ConfirmSetPassCode = (props) => {
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
        if (props.route.params.pass == Passcode) {
            let x = await storeJsonData("passcode", Passcode)
            let y = await storeData("passcodeVerification", true)
            props.navigation.navigate('Settings')
        }
        else {
            Alert.alert("New Passcode & Confirm Passcode doesn't match.")
        }
    }

    return (
        <>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => props.navigation.pop()}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => props.navigation.navigate("HomeScreen")}
                title="Confirm Set Passcode"
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Container>
                    <Content keyboardShouldPersistTaps={'never'} keyboardDismissMode={false}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ width: '80%', alignSelf: 'center', marginVertical: 5 }}>Confirm Passcode</Text>
                            <View style={{ backgroundColor: "#F6F6F6", width: "80%", height: 50 }}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{ flex: 1, paddingHorizontal: 10, textAlign: 'left', }}
                                    keyboardType={'number-pad'}
                                    keyboardAppearance={'dark'}
                                    returnKeyType={'default'}
                                    enablesReturnKeyAutomatically={true}
                                    value={Passcode}
                                    placeholder={'Enter Confirm Passcode'}
                                    // placeholderTextColor={AppColors.title_grey}
                                    onChangeText={(i) => setPasscode(i)}
                                />
                            </View>
                            <View style={{ height: 30 }}>
                            </View>
                            <CustomButton onPress={() => confirmPassCode()} title={'Confirm'} />
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        </>
    );
};


export default ConfirmSetPassCode;
