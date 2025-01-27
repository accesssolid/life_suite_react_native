#import <Firebase.h>
#import "AppDelegate.h"
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>

#import <GoogleMaps/GoogleMaps.h>
#import <GooglePlaces/GooglePlaces.h>




@implementation AppDelegate

// // Required for the register event.
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
// {
//  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }
// // Required for the notification event. You must call the completion handler after handling the remote notification.
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
// fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
// {
//   [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
// }
// // Required for the registrationError event.
// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
// {
//  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
// }
// // Required for localNotification event
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center
// didReceiveNotificationResponse:(UNNotificationResponse *)response
//          withCompletionHandler:(void (^)(void))completionHandler
// {
//   [RNCPushNotificationIOS didReceiveNotificationResponse:response];
// }


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   self.moduleName = @"LifeSuite";

   
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [GMSPlacesClient provideAPIKey:@"AIzaSyCqBdweD7WqRWXNUUC0sYMWnXG1jfnPCRk"];
  [GMSServices provideAPIKey:@"AIzaSyB5d--ow70_ZQqfsDdp2XSGX6AFg2tjhfU"];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}
- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
