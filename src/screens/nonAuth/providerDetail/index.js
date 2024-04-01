import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, ScrollView, Image, Modal, Pressable, Linking, TouchableOpacity, TextInput, Keyboard ,FlatList} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/header';
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
const { width, height } = Dimensions.get("window")
import { AirbnbRating, Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import moment from 'moment';

import DropDown from '../../../components/dropDown';
import { setFavList } from '../../../redux/features/favorites';
import CustomButton from '../../../components/customButton';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../../utils';

export default function ProviderDetail(props) {
    const { providerId, service, service_id } = props.route?.params
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loader, setLoader] = React.useState(false)
    const [provider, setProvider] = React.useState(null)
    const [pictures, setPictures] = React.useState([])
    const [ratings, setRatings] = React.useState([])
    const [totalRatings, setTotalRatings] = React.useState([])
    const [average_rating, setAverageRating] = React.useState(0)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalVisible1, setModalVisible1] = React.useState(false)
    const [modalVisible2, setModalVisible2] = React.useState(false)

    const [currentSelectedImage, setCurrentSelectedImage] = React.useState(0)
    const [selectedImage, setSelectedImage] = React.useState("")
    const [singleModal, setSingleModal] = React.useState(false)

    const [currentRating, setCurrentRating] = React.useState(0)
    const [sortBy, setSortBy] = React.useState(0)
    const [is_fav, setIsFav] = React.useState(false)
    const [questionaireData, setQuestionaireData] = useState({
        is_certified: 0,
        is_insauranced: 0,
        is_business_licensed: 0
    })
    useEffect(() => {
        getProviderDetail()
        getRatings()
    }, [])


    useEffect(() => {
        let ratingsCopy = [...totalRatings]
        if (sortBy == 0) {
            ratingsCopy.sort((a, b) => {
                let ac = moment(a.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                let bc = moment(b.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                if (ac < bc) {
                    return 1
                } else if (ac > bc) {
                    return -1
                }
                return 0
            })

        } else if (sortBy == 1) {
            ratingsCopy.sort((a, b) => {
                let ac = moment(a.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                let bc = moment(b.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                if (ac < bc) {
                    return -1
                } else if (ac > bc) {
                    return 1
                }
                return 0
            })

        }
        setRatings(ratingsCopy)
    }, [sortBy, totalRatings])

    useEffect(() => {
        if (provider?.pictures_data?.length > 0) {
            let new_arr = []
            while (provider?.pictures_data?.length) new_arr.push(provider?.pictures_data?.splice(0, 3));
            setPictures(new_arr)
        }
    }, [provider])
    useEffect(() => {

        console.log(provider)
        if (provider?.rating && provider?.rating != "") {
            setAverageRating(provider?.rating)
        }
    }, [provider])

    const getProviderDetail = async () => {
        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let body = new FormData()
            body.append("provider_id", providerId)
            if (service_id) {
                body.append("service_id", service_id)
            }
            let config = {
                headers: headers,
                data: body,
                endPoint: "/api/providerDetail",
                type: 'post'
            }
            let res = await getApi(config)
            console.log("Res", res)
            if (res.status) {
                setProvider(res.data)
                if (res?.data?.service_questionnaire) {
                    setQuestionaireData({
                        ...questionaireData,
                        is_business_licensed: res?.data?.service_questionnaire?.is_business_licensed == "1" ? 1 : 0,
                        is_certified: res?.data?.service_questionnaire?.is_certified == "1" ? 1 : 0,
                        is_insauranced: res?.data?.service_questionnaire?.is_insauranced == "1" ? 1 : 0,
                    })
                }
            }
        } catch (err) {
            console.warn(err)
        } finally {
            setLoader(false)
        }
    }

    const getRatings = async () => {
        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let body = new FormData()
            body.append("provider_id", providerId)
            body.append("orderBy", 'desc')
            let config = {
                headers: headers,
                data: body,
                endPoint: "/api/providerRating",
                type: 'post'
            }
            let res = await getApi(config)
            if (res.status) {
                setRatings(res.data)
                setTotalRatings(res.data)
            }
        } catch (err) {
            console.warn(err)
        } finally {
            setLoader(false)
        }
    }
    const year = (t) => {
        if (Number(t) > 1) {
            return " years"
        } else {
            return ' year'
        }
    }

    const like = () => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": providerId,
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/favouriteProviderAdd',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setIsFav(!is_fav)
                }
                else {
                }

            }).catch(err => {
                console.log("error", err)
            }).finally(() => {
                setLoader(true)
                getFavProvider()
            })
    }
    const dispatch = useDispatch()
    const favs = useSelector(state => state.favorites)?.list

    useEffect(() => {
        if (favs.map(x => x.id)?.includes(providerId)) {
            setIsFav(true)
        }

    }, [favs])

    useEffect(() => {
        getFavProvider()
    }, [])
    const getFavProvider = () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            endPoint: '/api/favouriteProviders',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setFavList([...response.data]))
                }
                else {
                    dispatch(setFavList([]))
                }
            }).catch(err => {
            }).finally(() => {
                setLoader(false)
            })
    }
    function formatPhoneNumber(phoneNumberString) {
        if (phoneNumberString) {
            var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
            if (cleaned?.length < 11) {
                var match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    return "+1" + '(' + match[1] + ') ' + match[2] + '-' + match[3];
                }
            }
            var match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return "+" + match[1] + '(' + match[2] + ') ' + match[3] + '-' + match[4];
            }
        }
        return null;
    }

    const checkToShowInput = (value) => {
        if (value == "" || value == "null") {
            return false
        }
        return true
    }

    const [seeAll, setSeeAll] = React.useState(false)

    const reportProvider = (description, feedback_type) => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            endPoint: '/api/addProviderFeedback',
            type: 'post',
            data: JSON.stringify({ description, feedback_type, provider_id: providerId })
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setModalVisible2(true)
                    // 
                }
                else {

                }
            }).catch(err => {
            }).finally(() => {
                setLoader(false)
            })
    }
    const navigation = useNavigation()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
                title={""}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}
                imageUrl1={require("../../../assets/homeWhite.png")}
                action1={() => {
                    if (props?.route?.params?.list) {
                        navigation.navigate("HomeScreen")
                    } else {
                        navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                    }
                }}
            />
            <Pressable style={{top: -45,zIndex: 1000, elevation: 10,width:90, left: (width / 2) - 45}} onPress={() => {
                setSingleModal(true)
                setSelectedImage(provider?.profile_image)
            }}>
                <Image
                    resizeMode='cover'
                    source={{ uri: BASE_URL + provider?.profile_image }}
                    style={{ width: 90, height: 90, borderWidth: 1, borderColor: LS_COLORS.global.green,  borderRadius: 45, backgroundColor: "gray" }}
                />
            </Pressable>
            <TouchableOpacity onPress={() => { like(provider.id) }} style={{ height: 20, width: 25, marginTop: -40, justifyContent: "center", alignSelf: 'center' }}>
                {is_fav
                    ?
                    <Image style={{ height: 18, width: 21 }} source={require('../../../assets/heartGreen.png')} resizeMode="cover" />
                    :
                    <Image style={{ height: 18, width: 21 }} source={require('../../../assets/whiteHeart.png')} resizeMode="cover" />
                }
            </TouchableOpacity>
            <View style={{ marginTop: -0 }}>
                <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: LS_COLORS.global.green }}>{provider?.first_name}{(provider?.last_name&&(provider?.last_name!=""||provider!="null"))?(" "+provider?.last_name):""}</Text>
                <View style={{ marginTop: 5, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 20 }}>
                    {questionaireData?.is_certified == 1 && <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../../../assets/profile/certify.png")} style={{ height: 15, width: 12 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Certified</Text>
                    </View>}
                    {questionaireData?.is_business_licensed == 1 && <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../../../assets/profile/license.png")} style={{ height: 15, width: 15 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Licensed</Text>
                    </View>}
                    {questionaireData?.is_insauranced == 1 && <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../../../assets/profile/insured.png")} style={{ height: 15, width: 15 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Insured</Text>
                    </View>}
                </View>
                <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black, marginHorizontal: 10 }}>{provider?.tagline}</Text>
            </View>

            <ScrollView style={{ paddingBottom: 50 }}>
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "white",
                    elevation: 5,
                    padding: 10,
                    marginHorizontal: 15,
                    marginTop: 10,
                    borderRadius: 10
                }}>
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black }}>Personal Information</Text>
                    {checkToShowInput(provider?.about) && <CustomInputViews title="Bio" text={provider?.about != "null" ? provider?.about : ""} />}
                    {Boolean(Number(provider?.phone_is_public)) && <Pressable
                        onPress={() => {
                            Linking.openURL("tel:" + formatPhoneNumber(provider?.phone_number))
                        }}
                    ><CustomInputViews title="Phone Number" text={formatPhoneNumber(provider?.phone_number)} /></Pressable>}
                    {Boolean(Number(provider?.address_is_public)) && <CustomInputViews title="Address" text={provider?.address[0]?.address_line_1} />}
                    {checkToShowInput(provider?.business_name) && <CustomInputViews title="Business Name" text={provider?.business_name != null ? provider?.business_name : ""} />}
                    {checkToShowInput(provider?.experience) && <CustomInputViews title="Experience" text={provider?.experience != "null" ? provider?.experience + year(provider?.experience) : ""} />}
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Certifications</Text>
                    {provider?.certificate_data.map(x => {
                        if (checkToShowInput(x.certificate)) {
                            return <CustomInputViews text={x.certificate} />
                        }
                        return null
                    })}
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Pictures</Text>
                    {pictures.map(x => {
                        return (
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                {x.map((picture, index) => <Pressable style={{ marginHorizontal: index == 1 ? 5 : 0 }} onPress={() => {
                                    setCurrentSelectedImage(picture)
                                    setModalVisible(true)
                                }}><Image
                                        source={{ uri: BASE_URL + picture?.image }}
                                        style={{ width: (width / 3) - 20, borderRadius: 5, aspectRatio: 1, backgroundColor: LS_COLORS.global.grey }}
                                    /></Pressable>)}
                            </View>
                        )
                    })}
                </View>
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "white",
                    elevation: 5,
                    padding: 10,
                    marginHorizontal: 15,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 40
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: "48%" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Filter rating</Text>
                            <DropDown
                                item={["1 Star", "2 Star", "3 Star", "4 Star", "5 Star", 'All']}
                                value={currentRating == 0 ? "All" : ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star",][currentRating - 1]}
                                onChangeValue={(index, value) => {
                                    if (index == 5) {
                                        setCurrentRating(0)
                                    } else {
                                        setCurrentRating(index + 1)
                                    }

                                }}

                                handleTextValue={true}
                                containerStyle={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, borderWidth: 0 }}
                                dropdownStyle={{ height: 6 * 40 }}
                            />

                        </View>
                        <View style={{ width: "48%" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Sort by</Text>
                            <DropDown
                                item={["Latest", "Oldest"]}
                                value={["Latest", "Oldest"][sortBy]}
                                onChangeValue={(index, value) => {
                                    setSortBy(index)
                                }}

                                handleTextValue={true}
                                containerStyle={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, borderWidth: 0 }}
                                dropdownStyle={{ height: 2 * 40, width: "48%" }}
                            />

                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 50 }}>
                        </View>
                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, textAlign: "center", fontSize: 16, marginTop: 5 }}>Customer Rating</Text>
                        <View style={{ width: 50 }}>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                        <Rating
                            count={5}
                            startingValue={average_rating}
                            type="custom"
                            ratingColor={LS_COLORS.global.green}
                            // tintColor={LS_COLORS.global.green}
                            showRating={false}
                            imageSize={24}
                            readonly={true}
                        />
                        <Text maxFontSizeMultiplier={1.3} style={{ marginLeft: 5, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: LS_COLORS.global.black }}>({average_rating})</Text>
                    </View>
                    {(ratings.length == 0 || ratings.filter(rate => {
                        if (currentRating != 0) {
                            if (Number(rate.rating) == currentRating) {
                                return true
                            }
                            return false
                        }
                        return true
                    }).length == 0) && <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsRegular, textAlign: "center", marginTop: 20 }}>No rating found</Text>}
                    {ratings.slice(0, seeAll ? undefined : 10).map(x => {
                        if (currentRating) {
                            if (currentRating != Number(x.rating)) {
                                return null
                            }
                        }
                        return (
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", width: "50%" }}>
                                        <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: "black" }}>{x.customers_first_name} {x.customers_last_name}</Text>
                                        <AirbnbRating
                                            count={1}
                                            defaultRating={1}
                                            selectedColor={LS_COLORS.global.green}
                                            showRating={false}
                                            size={14}
                                            isDisabled={true}
                                        />
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: "black" }} maxFontSizeMultiplier={1.3}>: {x?.rating != "null" ? Number(x.rating) : 0}</Text>
                                    </View>
                                    <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.grey }}>{moment(x.created_at, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY")}</Text>
                                </View>
                                <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, fontSize: 14, color: LS_COLORS.global.grey }}>{x.comment}</Text>
                            </View>
                        )
                    })}
                    {ratings?.length > 10 && <Text onPress={() => {
                        setSeeAll(!seeAll)
                    }} maxFontSizeMultiplier={1.4} style={{ fontSize: 14, alignSelf: "center", color: LS_COLORS.global.cyan, textDecorationLine: "underline", fontFamily: LS_FONTS.PoppinsRegular, paddingHorizontal: 5 }}>See {seeAll ? "Less" : "All"}</Text>}
                </View>
            </ScrollView>
            <Pressable onPress={() => {
                setModalVisible1(true)
            }} style={{ backgroundColor: LS_COLORS.global.green, position: "absolute", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 40, alignItems: "center", right: 0, top: height * .4 }}>
                <Text maxFontSizeMultiplier={1.2} style={{ color: "white" }}>R</Text>
                <Text maxFontSizeMultiplier={1.2} style={{ color: "white" }}>E</Text>
                <Text style={{ color: "white" }} maxFontSizeMultiplier={1.2} >P</Text>
                <Text style={{ color: "white" }} maxFontSizeMultiplier={1.2} >O</Text>
                <Text style={{ color: "white" }} maxFontSizeMultiplier={1.2} >R</Text>
                <Text style={{ color: "white" }} maxFontSizeMultiplier={1.2} >T</Text>
            </Pressable>
            {loader && <Loader />}
            <SingleModalPictureView visible={singleModal} setVisible={setSingleModal} image={selectedImage} />
            <ModalPictureView pictures={pictures} visible={modalVisible} setVisible={setModalVisible} currentImage={currentSelectedImage} />
            <ReportModal visible={modalVisible1} onPressSubmit={(d, t) => {
                reportProvider(d, t)
            }} setVisible={setModalVisible1} />
            <Reported first_name={provider?.first_name} visible={modalVisible2} setVisible={setModalVisible2} />
        </SafeAreaView>
    )
}

const CustomInputViews = ({ title, text }) => {
    return (
        <View style={{ position: "relative", padding: 10, borderWidth: 1, marginTop: 20, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7 }}>
            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }}>{title}</Text>
            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>{text}</Text>
        </View>
    )
}



const SingleModalPictureView = ({ visible, setVisible, image }) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <View style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: height * 0.9, width: width * 0.9, backgroundColor: "transparent", borderRadius: 20 }}>

                    <Pressable onPress={() => {
                        setVisible(false)
                    }}>
                        <Image
                            // key={x.image}
                            source={{ uri: BASE_URL + image }}
                            style={{ height: height * 0.9, width: width * 0.9, borderRadius: 20, }}
                            resizeMode="contain"
                        />
                    </Pressable>



                </View>
            </View>

        </Modal>
    )
}

const ModalPictureView = ({ pictures, visible, setVisible, currentImage }) => {
    const [pictures1, setPictures1] = React.useState([])
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const ref = React.useRef(null)
    React.useEffect(() => {
        if (pictures && currentImage) {
            let arr = []
            for (let p of pictures) {
                arr = [...arr, ...p]
            }
            arr = arr.filter(x => x.image != currentImage.image)
            setPictures1([currentImage, ...arr])
        }

    }, [pictures, currentImage])

    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <View style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: height * 0.9, width: width * 0.9, backgroundColor: "transparent", borderRadius: 20 }}>
                    <FlatList
                        ref={ref}
                        pagingEnabled
                        horizontal
                        data={pictures1}


                        keyExtractor={(item) => item.image}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onPress={() => {
                                    setVisible(false)
                                }}>
                                    <Image
                                        // key={x.image}
                                        source={{ uri: BASE_URL + item?.image }}
                                        style={{ height: height * 0.9, width: width * 0.9, borderRadius: 20, }}
                                        resizeMode="contain"
                                    />
                                </Pressable>
                            )

                        }}
                    />


                </View>
            </View>

        </Modal>
    )
}


const ReportModal = ({ visible, setVisible, onPressSubmit }) => {
    const [selected, setSelected] = React.useState(0)
    const data = ["Report Improper/Incorrect", "Picture", "Bio", "Business Name", "Certification", "Conduct", "Others"]
    const [desc, setDesc] = React.useState("")
    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <Pressable onPress={() => setVisible(false)} style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", alignItems: "center" }}>
                <Pressable onPress={() => {
                    Keyboard.dismiss()
                }} style={{ paddingBottom: 40, width: width * 0.9, padding: 15, backgroundColor: "white", borderRadius: 20 }}>
                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, textAlign: "center", textTransform: "uppercase" }} maxFontSizeMultiplier={1.4}>Report Provider</Text>
                    <DropDown
                        item={data}
                        value={data[selected]}
                        onChangeValue={(index, value) => {
                            setSelected(index)
                        }}
                        handleTextValueStyle={{ color: selected == 0 ? "grey" : "black" }}
                        handleTextValue={true}
                        containerStyle={{
                            borderRadius: 6, backgroundColor: LS_COLORS.global.white, marginBottom: 10, marginTop: 20, borderWidth: 0,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            backgroundColor: "white",
                            elevation: 5,
                        }}
                        dropdownStyle={{ height: 7 * 40, width: "82%" }}
                    />
                    <View style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        backgroundColor: "white",
                        elevation: 5,
                        minHeight: 100,
                        padding: 10,
                        borderRadius: 15
                    }}>
                        <TextInput
                            multiline
                            value={desc}
                            onChangeText={t => setDesc(t)}
                            placeholder='Description'
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkGray }}

                        />
                    </View>
                    <CustomButton action={() => {
                        if (selected == 0) {
                            showToast("Please select options")
                            return
                        }
                        if (desc?.trim() == "") {
                            showToast("Please write description")
                            return
                        }

                        setVisible(false)
                        onPressSubmit(desc, data[selected])
                    }} maxFont={1.3} customTextStyles={{ fontSize: 14 }} title="Submit" customStyles={{ width: 120, height: 30, paddingHorizontal: 10, marginTop: 30 }} />
                </Pressable>
            </Pressable>

        </Modal>
    )
}


const Reported = ({ visible, setVisible, first_name }) => {
    const [selected, setSelected] = React.useState(0)
    const data = ["Report Improper/Incorrect", "Picture", "Bio", "Business Name", "Certification", "Conduct", "Others"]
    const navigation = useNavigation()
    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <Pressable onPress={() => {
                setVisible(false)
                navigation.goBack()
            }} style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", alignItems: "center" }}>
                <View style={{ paddingBottom: 40, width: width * 0.8, justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: 20 }}>
                    <Image style={{ width: width * 0.2, height: height * 0.1, marginTop: 5 }} resizeMode="contain" source={require("../../../assets/profile/report.png")} />
                    <Text maxFontSizeMultiplier={1.3} style={{ color: LS_COLORS.global.darkGray, fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium }}>You just reported {first_name}!</Text>
                    <Text maxFontSizeMultiplier={1.3} style={{ color: LS_COLORS.global.darkGray, fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10 }}>One of our team member</Text>
                    <Text maxFontSizeMultiplier={1.3} style={{ color: LS_COLORS.global.darkGray, fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Will look and inspect the</Text>
                    <Text maxFontSizeMultiplier={1.3} style={{ color: LS_COLORS.global.darkGray, fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>reported issues.</Text>
                </View>
            </Pressable>

        </Modal>
    )
}