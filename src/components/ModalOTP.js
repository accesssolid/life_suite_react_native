import React from "react";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { Modal, View, Dimensions, StyleSheet, Text, ActivityIndicator } from "react-native";
import CustomButton from './customButton';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { getApi } from "../api/api";
import { showToast } from "../utils";

const { width, height } = Dimensions.get("window");

export default function ModalOTP({ visible, setVisible, setIsVerifiedPhone, phone_number }) {
    const [code, setCode] = React.useState("")
    const [loader, setLoader] = React.useState(false)
    const otpRef = React.useRef(null)
    React.useEffect(() => {
        // if (visible) {
        setLoader(false)
        setCode("")
        // }

        if (visible) {
            setTimeout(() => {
                otpRef?.current.focusField(0)
            }, 500);
        }
    }, [visible])
    const VerifyPhoneNumber = async () => {
        try {
            setLoader(true)
            let headers = {
                "Content-Type": "multipart/form-data",
            }
            let formdata = new FormData()
            formdata.append("phone_number", phone_number)
            formdata.append("otp", code)

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/verifyPhoneOtp',
                type: 'post'
            }

            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
                setIsVerifiedPhone(true)
                setVisible(false)
            } else {
                showToast(response.message)
                setIsVerifiedPhone(false)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoader(false)
        }
    }

    const checkISVerified = async () => {

        if (phone_number.length < 11) {
            showToast("Phone number must be 10 digits.")
            return
        }
        try {
            setLoader(true)
            let headers = {
                "Content-Type": "multipart/form-data",
            }
            let formdata = new FormData()
            formdata.append("phone_number", phone_number)

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/verifyPhoneOtpSend',
                type: 'post'
            }

            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
            } else {
                showToast(response.message)
            }
        } catch (err) {
            showToast("Phone number must be 10 digits.")

        } finally {
            setLoader(false)
        }
    }
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "center", paddingHorizontal: "10%" }}>
                {!loader ? <View style={{ padding: 10, backgroundColor: "white", borderRadius: 10, paddingHorizontal: "10%", paddingVertical: "5%" }}>

                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 18, marginVertical: 20, textAlign: "center" }}>A 4 digit OTP is sent to your Mobile Number.</Text>

                    <View style={{ zIndex: 10000 }}>
                        <OTPInputView
                            ref={otpRef}
                            code={code}
                            autoFocusOnLoad={false}
                            pinCount={4}
                            style={styles.otp}
                            codeInputFieldStyle={styles.input}
                            placeholderTextColor="black"
                            keyboardType="number-pad"
                            onCodeChanged={code => setCode(code)}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                        <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>Don't receive a code?</Text>
                        <Text maxFontSizeMultiplier={1.5} onPress={() => checkISVerified()} style={{ color: LS_COLORS.global.green, fontFamily: LS_FONTS.PoppinsSemiBold }}>Resend</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30 }}>

                        <CustomButton action={() => {
                            VerifyPhoneNumber()
                        }} title="Verify"  customTextStyles={{fontSize:14}} customStyles={{ marginBottom: 0, borderRadius: 5, width: width * 0.25 }} />
                        <CustomButton
                            action={() => {
                                setVisible(false)
                            }}
                            title="Cancel" customTextStyles={{fontSize:14}}  customStyles={{ marginBottom: 0, borderRadius: 5, width: width * 0.25, backgroundColor: "#d9534f" }} />
                    </View>
                </View> :
                    <View style={{ width: 80, height: 80, alignSelf: "center", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 10 }}>
                        <ActivityIndicator color={LS_COLORS.global.green} size={25} />
                    </View>
                }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // backgroundColor: Colors.white,
    },
    design: {
        height: 220,
        width: 300,
    },
    forgot: {
        alignSelf: 'center',
        fontSize: 30,
        lineHeight: 40,
        color: LS_COLORS.global.black,
        fontFamily: LS_FONTS.PoppinsBold
    },
    email: {
        fontSize: 16,
        lineHeight: 18,
        color: LS_COLORS.global.grey,
        fontFamily: LS_FONTS.PoppinsBold,
        alignSelf: "center"
    },
    input: {
        color: LS_COLORS.global.darkBlack,
        borderColor: "#D3D3D3",
        borderRadius: 5,
    },
    otp: {
        width: "100%",
        height: 48,
        zIndex: 3000,
        alignSelf: 'center'
    },

});