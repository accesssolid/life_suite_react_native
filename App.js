import React, { useEffect } from 'react';
import { Platform, StatusBar, Linking } from 'react-native'

/* Packages */
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Root } from 'native-base';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';

/* Constants */
import LS_COLORS from './src/constants/colors';

/* Redux Store */
import store from './src/redux/store';

/* Root Navigator */
import Router from './src/router';

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    // process the notification
    if(notification.data?.link){
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
    UserStack:{
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
  const getToken = async () => {
    try {
      let gg = await messaging().getToken()
      console.log(gg, "Token")
    } catch (err) {

    }

  }

  useEffect(() => {
    // getToken()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
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
          userInfo:remoteMessage.data
        });
      }

    })

    messaging().onMessage(async remoteMessage => {
      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: 'test',
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          userInfo:remoteMessage.data

        });
      }

    })
  }, []);

  return (
    <Root>
      <StoreProvider store={store}>
        <StatusBar backgroundColor={LS_COLORS.global.cyan} barStyle="dark-content" />
        <SafeAreaProvider>
        <NavigationContainer linking={linking} onStateChange={(e)=>{
          console.log("navigation_state",JSON.stringify(e))
        }} >
          <Router />
          </NavigationContainer>
        </SafeAreaProvider>
      </StoreProvider>
    </Root>
  );
};

export default App;