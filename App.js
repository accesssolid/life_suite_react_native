import React, { useEffect } from 'react';
import { Platform, StatusBar, Linking, AppState } from 'react-native'

/* Packages */
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Root } from 'native-base';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

/* Constants */
import LS_COLORS from './src/constants/colors';

/* Redux Store */
import store from './src/redux/store';

/* Root Navigator */
import Router from './src/router';
import { changeStatus, loginReducer, logoutAll } from './src/redux/features/loginReducer';
import { stringify } from 'query-string';
import { removeItem, retrieveItem } from './src/components/validators';
import { role } from './src/constants/globals';
import { getApi } from './src/api/api';
import { changeSwitched } from './src/redux/features/switchTo';



PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    // if(notification.)
    // process the notification
    if (notification.data?.link) {
      Linking.openURL(notification.data?.link)
    }
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
})

const deepLinksConf = {
  screens: {
    ProviderStack: {
      screens: {
        OrderDetail: "provider_order_detail/:order_id",
      }
    },
    UserStack: {
      screens: {
        OrderDetailCustomer: "customer_order_detail/:order_id",
      }
    }
  },
};

const linking = {
  prefixes: ['lifesuite://'],
  config: deepLinksConf
}

const App = () => {
  // function for getting noti token from #liahs
  const navigationRef=React.useRef(null)
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

  const getToken = async () => {
    try {
      let gg = await messaging().getToken()
      console.log(gg, "Token")
    } catch (err) {

    }

  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        getData()
      } else {

      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const getData = async () => {
    try {
      let user = await retrieveItem("user")
      let token = await retrieveItem("access_token")
      if(!user){
        return
      }
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      let user_data = {
        "user_id": user.id,
      }
      let config = {
        headers: headers,
        data: JSON.stringify(user_data),
        endPoint: user.user_role == role.customer ? '/api/customer_detail' : '/api/provider_detail',
        type: 'post'
      }
      const response = await getApi(config)
      console.log("Response", response)
      if (response.status == true) {
        store.dispatch(loginReducer(response.data))
      }
    } catch (err) {
      console.warn(err)
    }

  }


  useEffect(() => {
    // PushNotification.setApplicationIconBadgeNumber(10)
    getToken()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
      try {
        console.log(typeof remoteMessage?.data?.is_blocked)
        if (remoteMessage?.data?.is_blocked == "true") {
          store.dispatch(changeStatus(3))
          getData()
        } if (remoteMessage?.data?.is_blocked == "false") {
          store.dispatch(changeStatus(1))
          getData()
        }
        if (remoteMessage?.data?.is_inactive == "true") {
          store.dispatch(changeStatus(1))
          store.dispatch(logoutAll())
          store.dispatch(changeSwitched(true))
          
          // if (navigationRef?.current?.isReady()) {
            navigationRef?.current?.navigate("WelcomeScreen")
          // }
         
        }
      } catch (err) {

      }


      if (Platform.OS == 'android') {
        PushNotification.createChannel(
          {
            channelId: "channel-id", // (required)
            channelName: "My channel", // (required)

          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.localNotification({
          channelId: "channel-id", // (required) channelId, if the channel doesn't exist, notification will not trigger.
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body, // (required)
          userInfo: remoteMessage.data
        });
      }

    })

    messaging().onMessage(async remoteMessage => {
      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: 'test',
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          userInfo: remoteMessage.data

        });
      }

    })
  }, []);

  return (
    <Root>
      <StoreProvider store={store}>
        <StatusBar backgroundColor={LS_COLORS.global.green} barStyle="light-content" />
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef} linking={linking} onStateChange={(e) => {
            // console.log("navigation_state",JSON.stringify(e))
          }} >
            <Router />
          </NavigationContainer>
        </SafeAreaProvider>
      </StoreProvider>
    </Root>
  );
};

export default App;