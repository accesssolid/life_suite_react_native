import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, StatusBar, Modal, Image, TouchableOpacity, FlatList, Platform, Pressable } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Row } from 'native-base'
import { BASE_URL } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import FastImage from 'react-native-fast-image'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import Loader from '../../../components/loader';

const ChatScreen = (props) => {
    const data = props.route.params.item
    const user = useSelector(state => state.authenticate.user)
    const [messages, setMessages] = useState("");
    const flatlistRef = useRef();
    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [arr, setArr] = useState([])
    const [read, setRead] = useState(0)
    const [loader, setLoader] = useState(false)

    const getRoomName = () => {
        let temp = [user.id.toString(), data.id.toString()].sort()
        let roomname = temp.join('_');
        return roomname
    }

    const getPermissons = async () => {
        let x = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    }

    useEffect(() => {
        if (Platform.OS == "android") {
            getPermissons()
        }
    }, [])

    const pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            uploadImage(image)
            setVisible(!visible)
        }).catch(err => {
        })
    }

    const CaptureImage = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            uploadImage(image)
            setVisible(!visible)
        }).catch(err => {
        })
    }

    const PickDocument = async () => {
        // Opening Document Picker to select one file
        try {
            const fileDetails = await DocumentPicker.pick({
                // Provide which type of file you want user to pick
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc],
                copyTo: "documentDirectory"
            });
            // Setting the state for selected File
            uploadFile(...fileDetails)
            setVisible(false)

        } catch (error) {
            // If user canceled the document selection
            alert(
                DocumentPicker.isCancel(error)
                    ? "Canceled"
                    : "Unknown Error: " + JSON.stringify(error)
            );
        }
    };


    const uploadFile = async (filePath) => {
        setLoader(true)
        if (Platform.OS == "android") {
            const stat = await RNFetchBlob.fs.stat(filePath.fileCopyUri)
            const task = storage()
                .ref(
                    `/myfiles/${stat.filename}`
                )
                .putFile(stat.path);
            try {
                await task;
            } catch (e) {
                console.error(e);
                setLoader(false)
            }
        }
        else {
            const task = storage()
                .ref(
                    `/myfiles/${filePath.name}`
                )
                .putFile(filePath.uri.replace("file://", ""));
            try {
                await task;
            } catch (e) {
                console.error(e);
                setLoader(false)
            }
        }
        const url = await storage()
            .ref(
                `/myfiles/${filePath.name}`
            )
            .getDownloadURL();
        setLoader(false)
        handleMessage(url, 'document')
    }

    const uploadImage = async (data) => {
        setLoader(true)
        const filename = data.path.split('/').pop();
        const uploadUri = Platform.OS === 'ios' ? data.path.replace('file://', '') : data.path;
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        try {
            await task;
            setLoader(false)
        } catch (e) {
            console.error(e);
            setLoader(false)
        }
        const url = await storage()
            .ref(filename)
            .getDownloadURL();
        setLoader(false)
        handleMessage(url, 'image')
    };

    useEffect(() => {
        let arr1 = 0
        let id = 0
        const messagesListener = firestore()
            .collection('Chats').doc(getRoomName())
            .onSnapshot(querySnapshot => {
                if (querySnapshot._data) {
                    setArr([...querySnapshot._data.messages])
                    arr1 = querySnapshot._data.messages.length
                    if (querySnapshot._data.participants.user1.id == user.id) {
                        setRead(querySnapshot._data.readOffSet.user2.read)
                        firestore()
                            .collection('Chats').doc(getRoomName()).update({
                                'readOffSet.user1.read': 0,
                                'readOffSet.user2.read': querySnapshot._data.readOffSet.user2.read
                            })
                            .then(() => {
                            });
                    }
                    else {
                        setRead(querySnapshot._data.readOffSet.user1.read)
                        firestore()
                            .collection('Chats').doc(getRoomName()).update({
                                'readOffSet.user2.read': 0,
                                'readOffSet.user1.read': querySnapshot._data.readOffSet.user1.read
                            })
                            .then(() => {
                            });
                    }
                }
                else {
                    setArr([])
                }
            });
        return () => messagesListener();
    }, []);

    const renderAddmodal = props => {
        return (
            <Modal
                visible={visible}
                transparent={true}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, width: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 250, width: '90%', backgroundColor: "ghostwhite", borderColor: "#ACF0F2", borderWidth: 2, borderRadius: 10, justifyContent: 'space-evenly' }} >
                        <Text style={{ textAlign: 'center', fontFamily: LS_FONTS.PoppinsMedium, padding: 10, fontSize: 18 }} >Upload Attachements</Text>
                        <TouchableOpacity onPress={() => {
                            pickImage()

                        }} style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: "center" }} >
                            <Image source={require('../../../assets/cameraChat.png')} style={{ height: 25, width: 25, resizeMode: 'contain', alignItems: 'center', }} />
                            <Text style={{ alignItems: 'center', marginHorizontal: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15 }} >Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                CaptureImage()

                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                            <Image source={require('../../../assets/gallery.png')} style={{ height: 25, width: 25, resizeMode: 'contain', alignItems: 'center', }} />
                            <Text style={{ alignItems: 'center', marginHorizontal: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15 }} >Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                PickDocument()

                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                            <Image source={require('../../../assets/documents.png')} style={{ height: 25, width: 25, resizeMode: 'contain', alignItems: 'center', }} />
                            <Text style={{ alignItems: 'center', marginHorizontal: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15 }} >Document</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }



    const showFile = (fileUrl) => {
        const ext = fileUrl.split(/[#?]/)[0].split('.').pop().trim();
        return new Promise((resolve, reject) => {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: ext,
            })
                .fetch('GET', fileUrl)
                .then(res => {
                    const downloadFile =
                        Platform.OS === 'android'
                            ? 'file://' + res.path()
                            : '' + res.path();
                    setTimeout(() => {
                        FileViewer.open(downloadFile, {
                            showOpenWithDialog: true,
                            onDismiss: () => RNFetchBlob.fs.unlink(res.path()),
                        });
                    }, 350);
                    resolve(true);
                })
                .catch(err => {
                    setLoading(false);
                    showToast('Unable to open it!');
                    reject(err);
                });
        });
    };

    async function handleMessage(text, type) {
        const text1 = text
        const array1 = [user.id.toString(), data.id.toString()].sort()
        let user1 = null
        let user2 = null

        if (array1[0] == user.id.toString()) {
            user1 = user
            user2 = data
        } else {
            user1 = data
            user2 = user
        }
        let newMessage = {
            message: text1,
            sender: user,
            time: new Date().getTime(),
            type: type,
            show: false
        }
        if (text1.trim() !== '') {
            firestore()
                .collection(`Chats`)
                .doc(getRoomName())
                .set({
                    participants: {
                        user1: user1,
                        user2: user2
                    },
                    lastMessage: type == 'text' ? text1 : 'Image',
                    lastMessageTime: new Date().getTime(),
                    messages: [...arr, newMessage],
                    roomid: getRoomName(),
                    readOffSet: {
                        user1: {
                            user1: user1,
                            read: array1[0] == user.id.toString() ? 0 : read + 1
                        },
                        user2: {
                            user2: user2,
                            read: array1[0] == user.id.toString() ? read + 1 : 0
                        }

                    }

                })

        }
        setMessages('')
    }



    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#ACF0F2" }} edges={["top"]}>

                {/* <RenderAddmodal
                visible = {visible}
                /> */}
                {renderAddmodal()}
                <Header
                    title={data.first_name}
                    imageUrl={require("../../../assets/back.png")}
                    action={() => {
                        props.navigation.goBack()
                    }}
                    imageUrl1={require("../../../assets/3dot.png")}
                    action1={() => {
                        setVisible1(true)
                    }}
                />
                <View style={{ flex: 1, backgroundColor: "white" }}>

                    <FlatList
                        contentContainerStyle={{ justifyContent: 'flex-end' }}
                        showsVerticalScrollIndicator={false}
                        data={[...arr].reverse()}
                        ref={flatlistRef}
                        inverted
                        keyExtractor={(item, index) => index}
                        renderItem={itemData => {
                            if (itemData.item.type == 'text') {
                                if (user.id === itemData.item.sender.id) {
                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    marginTop: '5%',
                                                    width: '90%',
                                                    alignSelf: 'center'
                                                }}>
                                                <View
                                                    style={{
                                                        maxHeight: 75,
                                                        maxWidth: '70%',
                                                        backgroundColor: "#F5FEFF",
                                                        right: '5%',
                                                        padding: 20,
                                                        borderRadius: 9,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={{ fontSize: 12, color: "black", fontFamily: LS_FONTS.PoppinsRegular, }}>
                                                        {itemData.item.message}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-end',
                                                    marginTop: '3%',
                                                    marginRight: '5%'
                                                }}>
                                                <Text
                                                    style={{
                                                        right: 5,
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                                <Image
                                                    source={{ uri: BASE_URL + itemData.item.sender.profile_url }}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        alignSelf: 'center',
                                                        borderRadius: 10
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )
                                }
                                else {
                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    marginTop: '5%',
                                                    width: '90%',
                                                    alignSelf: 'center'
                                                }}>
                                                <View
                                                    style={{
                                                        maxHeight: 75,
                                                        maxWidth: '70%',
                                                        backgroundColor: "#F5FEFF",
                                                        left: '5%',
                                                        padding: 20,
                                                        borderRadius: 9,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={{ fontSize: 12, color: "black", fontFamily: LS_FONTS.PoppinsRegular, }}>
                                                        {itemData.item.message}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-start',
                                                    marginTop: '3%',
                                                    marginLeft: '5%'
                                                }}>
                                                <Image
                                                    source={{ uri: BASE_URL + itemData.item.sender.profile_url }}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        alignSelf: 'center',
                                                        borderRadius: 10
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        left: 5,
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }
                            }
                            else if (itemData.item.type == 'document') {
                                if (user.id === itemData.item.sender.id) {
                                    return (
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                showFile(itemData.item.message)
                                            }}
                                                style={{ marginTop: '3%', borderColor: "#ACF0F2", alignItems: 'center', borderWidth: 1, padding: 10, justifyContent: "space-between", flexDirection: 'row', width: '50%', alignSelf: 'flex-end', marginRight: '5%', borderRadius: 5, overflow: 'hidden' }}>
                                                <Image
                                                    style={styles.file}
                                                    source={require('../../../assets/document.png')}
                                                />
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        width: '90%',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                        fontSize: 10,
                                                        marginLeft: 5
                                                    }}>
                                                    {itemData.item.message}
                                                </Text>
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-end',
                                                    marginTop: '3%',
                                                    marginRight: '5%'
                                                }}>
                                                <Text
                                                    style={{
                                                        marginRight: '5%',
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                            </View>
                                        </View>

                                    )
                                }
                                else {
                                    return (
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                showFile(itemData.item.message)
                                            }}
                                                style={{ marginTop: '3%', borderColor: "#ACF0F2", alignItems: 'center', borderWidth: 1, padding: 10, justifyContent: "space-between", flexDirection: 'row', width: '50%', alignSelf: 'flex-start', marginLeft: '5%', borderRadius: 5, overflow: 'hidden' }}>
                                                <Image
                                                    style={styles.file}
                                                    source={require('../../../assets/document.png')}
                                                />
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        width: '90%',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                        fontSize: 10,
                                                        marginLeft: 5
                                                    }}>
                                                    {itemData.item.message}
                                                </Text>
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-start',
                                                    marginTop: '3%',
                                                    marginLeft: '5%'
                                                }}>
                                                <Text
                                                    style={{
                                                        left: 5,
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }

                            }

                            else {
                                if (user.id === itemData.item.sender.id) {
                                    return (
                                        <View>
                                            <View style={{ marginTop: '3%', alignSelf: 'flex-end', marginRight: '5%', borderRadius: 20, overflow: 'hidden' }}>
                                                <FastImage
                                                    source={{ uri: itemData.item.message, priority: FastImage.priority.high, }}
                                                    style={{
                                                        width: 250,
                                                        height: 216,
                                                        alignSelf: 'flex-end',
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-end',
                                                    marginTop: '3%',
                                                    marginRight: '5%'
                                                }}>
                                                <Text
                                                    style={{
                                                        marginRight: '5%',
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                            </View>
                                        </View>

                                    )
                                }
                                else {
                                    return (
                                        <View style={{ marginTop: '3%', alignSelf: 'flex-start', marginLeft: '5%', overflow: 'hidden' }}>
                                            <FastImage
                                                source={{ uri: itemData.item.message, priority: FastImage.priority.high, }}
                                                style={{
                                                    width: 250,
                                                    height: 216,
                                                    alignSelf: 'flex-start',
                                                    borderRadius: 20
                                                }}
                                            />
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-start',
                                                    marginTop: '3%',
                                                    marginRight: '5%'
                                                }}>
                                                <Text
                                                    style={{
                                                        left: 5,
                                                        alignSelf: 'center',
                                                        fontSize: 11,
                                                        lineHeight: 13,
                                                        color: '#63697B',
                                                        fontFamily: LS_FONTS.PoppinsRegular,
                                                    }}>
                                                    {moment(itemData.item.time).format('hh:mm A')}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }

                            }
                        }}
                    />
                    <View style={{ height: 40 }}></View>
                    <View style={styles.sendingContainer}>
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Image style={{ height: 30, width: 30 }} source={require('../../../assets/addChat.png')} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="Type your message"
                            placeholderTextColor="black"
                            autoCapitalize={'none'}
                            color="#9A9CA4"
                            placeholderTextColor="#9A9CA4"

                            autoCorrect={false}
                            onChangeText={(text) => setMessages(text)}
                            value={messages}
                        />

                        <TouchableOpacity style={{ width: "10%", justifyContent: 'center', alignItems: "center" }} onPress={() => {
                            if (messages.trim() === "") {
                                showToast("Message cannot be empty!")
                            }
                            else {
                                handleMessage(messages, 'text')
                            }
                        }} >
                            <Image style={styles.send} source={require("../../../assets/send.png")} />
                        </TouchableOpacity>
                    </View>
                    {loader && <Loader />}
                </View>
            </SafeAreaView>
            <MenuModal visible={visible1} role={user.user_role} user1={data.id.toString()} setVisible={setVisible1} navigation={props.navigation} />
        </>
    )
}

export default ChatScreen;

const MenuModal = ({ visible, setVisible, role, navigation, user1 }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            style={{ flex: 1 }}
        >
            <Pressable onPress={() => setVisible(false)} style={{ flex: 1, alignItems: "flex-end", paddingTop: "8%" }}>
                <Pressable
                    onPress={() => {
                        setVisible(false)
                        if (role == 3) {
                            navigation.navigate("OrderHistoryProvider", { user1: user1 })
                        } else {
                            navigation.navigate("OrderHistoryCustomer", { user1: user1 })
                        }
                    }}
                    style={{ height: 30, justifyContent: "center", borderColor: LS_COLORS.global.green, alignItems: "center", width: 100, backgroundColor: "white", borderRadius: 2, borderWidth: 1, marginRight: 5 }}>
                    <Text style={[styles.msgText, { color: "black", fontSize: 14 }]}>Order History</Text>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    sendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 15,
        width: "85%",
        alignSelf: "center"
    },
    systemMessageText: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    rightView: {
        backgroundColor: "darkgreen",
        padding: 5,
        borderRadius: 10,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        right: 3,
        top: 3,
        margin: 2
    },
    leftView: {
        backgroundColor: "darkslategrey",
        padding: 5,
        borderRadius: 10,
        alignSelf: "flex-start",
        alignItems: 'flex-start',
        left: 3,
        top: 3,
        margin: 2
    },
    msgText: {
        fontSize: 20,
        color: "white",
    },
    inputStyle: {
        padding: 10,
        height: 50,
        width: "90%",
        fontFamily: LS_FONTS.PoppinsRegular
    },
    send: {
        tintColor: "#ACF0F2",
        height: 30,
        width: 30,
    },
    add: {
        right: 10,
        bottom: 3
    },
    file: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
})





