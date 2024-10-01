import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Pressable,
  ImageBackground,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Header from '../../../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApi } from '../../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/loader';
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { showToast, storeItem } from '../../../components/validators';
import CustomDeleteModal from '../../../components/CustomDeleteModal';
import { logoutAll } from '../../../redux/features/loginReducer';
import { role } from '../../../constants/globals';

export default function DeleteAccount({ navigation, route }) {
  const dispatch = useDispatch()
  const access_token = useSelector(state => state.authenticate.access_token)
  const user = useSelector(state => state.authenticate.user)
  const userType = useSelector(state => state.authenticate.type)
  console.log("PPPP", user?.user_role == role.customer ? "true" : "False")
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = React.useState(false)
  const [message, setmessage] = useState("")
  const [ShowModal, setShowModal] = useState(false);
  const [id, setId] = React.useState(null);
  const [user_role, setRole] = React.useState(null);

  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const scrollRef = React.useRef(null);
  const [editable, setEditable] = React.useState(true);



  const onSubmit = () => {
    setLoading(true);

    let body = {
      delete_reason: message,
    };

    let headers = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',  // Make sure the Content-Type header is set
      Accept: 'application/json'           // Ensure the response is expected to be JSON
    };

    let config = {
      headers: headers,
      endPoint: user?.user_role == role.customer ? '/api/deleteAccountProfile' : '/api/deleteAccountProfileProvider',
      type: 'post',
      body: body // Convert body to JSON string
    };
    console.log("config", config)
    // return
    getApi(config)
      .then((response) => {
        try {
          // console.log("Response", JSON.stringify(response));

          // Check if the response status is true
          if (response.status === true) {
            setLoading(false);
            storeItem('user', null)
            storeItem('passcode', null)
            navigation.navigate('WelcomeScreen1')
            dispatch(logoutAll())
          } else {
            setLoading(false);
            storeItem('user', null)
            storeItem('passcode', null)
            navigation.navigate('WelcomeScreen1')
            dispatch(logoutAll())
          }
        } catch (error) {
          console.log("Error parsing JSON:", error);
        }
      })
      .catch(err => {
        console.log("API error:", err);
        setLoading(false);
      });
  };


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: LS_COLORS.global.green }}>
        <Header
          containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}
          imageUrl={require('../../../assets/back.png')}
          action={() => navigation.goBack()}
          // imageUrl1={require("../../assets/home.png")}
          // action1={() => props.navigation.navigate("HomeScreen")}
          title={'Delete Account'}
        />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'none'}
            style={{ backgroundColor: 'white', flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{ alignItems: 'center' }}
              showsVerticalScrollIndicator={false}
              style={{ padding: 10 }}>
              {/* <View style={{ alignItems: "center" }}> */}
              <View style={{ marginTop: 20 }} />

              <TextInput
                style={[
                  styles.inputMaskStyle,
                  { height: 120, textAlignVertical: 'top' },
                ]}
                multiline={true}
                placeholder="I am deleting this account because…"
                placeholderTextColor={'gray'}
                onChangeText={setmessage}
                value={message}
                onFocus={d => {
                  setTimeout(() => {
                    scrollRef?.current?.scrollTo({ y: 1000 });
                  }, 200);
                }}
                maxFontSizeMultiplier={1.2}
                ref={messageRef}
              />
              {/* </View> */}
              <View style={{ marginBottom: 100 }} />
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={styles.save}
            activeOpacity={0.7}
            onPress={() => {
              if (message) {
                setShowModal(true)
              } else {
                showToast("Please Enter Message")
              }

              // submit();
            }}>
            <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading && <Loader />}
      <CustomDeleteModal
        // modalIcon={images.deleteIcon}
        YesTitle={"Delete"}
        CancelTitle={"Cancel"}
        onPresYes={() => {
          setShowModal(false)
          onSubmit()
          // DeletingAccount()
        }}
        onPresCancel={() => { setShowModal(false) }}
        isvisible={ShowModal}
        nameTitle={"Delete Account"}
        Title={"Are you sure!"} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LS_COLORS.global.white,
  },
  text: {
    fontSize: 16,
    fontFamily: LS_FONTS.PoppinsBold,
    marginTop: 16,
    alignSelf: 'center',
  },
  text1: {
    fontSize: 18,
    fontFamily: LS_FONTS.PoppinsMedium,
    marginTop: 16,
    alignSelf: 'center',
    color: LS_COLORS.global.green,
  },
  text2: {
    fontSize: 12,
    fontFamily: LS_FONTS.PoppinsRegular,
    alignSelf: 'center',
    color: '#5A5A5A',
  },
  personalContainer: {
    maxHeight: '100%',
    marginTop: '3%',
    width: '90%',
    elevation: 200,
    shadowColor: '#00000029',
    backgroundColor: 'white',
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    borderRadius: 10,
    alignSelf: 'center',
  },
  save: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '40%',
    backgroundColor: LS_COLORS.global.green,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 15,
  },
  saveText: {
    fontSize: 13,
    fontFamily: LS_FONTS.PoppinsMedium,
    color: LS_COLORS.global.white,
  },
  inputMaskStyle: {
    borderRadius: 7,
    borderColor: LS_COLORS.global.textInutBorderColor,
    paddingLeft: 16,
    width: '90%',
    alignSelf: 'center',
    color: LS_COLORS.global.black,
    height: 60,
    fontFamily: LS_FONTS.PoppinsMedium,
    fontSize: 14,
    borderWidth: 1,
    marginTop: 10,
  },
});
