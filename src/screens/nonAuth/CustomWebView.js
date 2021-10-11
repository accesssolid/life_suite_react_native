import { Container} from 'native-base'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview';
import Loader from '../../components/loader';
const CustomWebView = ({ navigation ,route}) => {
    const {uri,title}=route.params
    const [loader,setLoader] = React.useState(false)

    return (
        <Container>
            <WebView 
                onLoadStart={(e)=>{
                    setLoader(true)
                }}
                onLoadEnd={e=>{
                    setLoader(false)
                }}
                source={{ uri: uri}} 
                onShouldStartLoadWithRequest={e=>{
                    if(e.url.includes("return")||e.url.includes("refresh")){
                        setLoader(false)
                        navigation.pop()
                        return false
                    }
                    return true
                }}
                style={{
                    flex:1
                }} 
            />
            {loader&&<Loader/>}
        </Container>
    )
}

export default CustomWebView

