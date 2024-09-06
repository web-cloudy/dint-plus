#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNCallKeep/RNCallKeep.h>
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTLinkingManager.h>
#import <GoogleMaps/GoogleMaps.h>
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h""
#import "RNSplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Dint";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [FIRApp configure];
   
  [RNVoipPushNotificationManager voipRegistration];
  [RNCallKeep setup:@{
      @"appName": @"DINT+",
      @"maximumCallGroups": @1,
      @"maximumCallsPerCallGroup": @1
    }];
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
 [GMSServices provideAPIKey:@"AIzaSyCmI0Rfe_sLW3KDfsFwhFQRDdMDJSojwn0"];
 [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  return YES;

}


//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}


// Required to register for notifications

-(void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
[RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}


// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the localNotification event.

-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
[RNCPushNotificationIOS didReceiveLocalNotification:notification];
}


// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}


//- (BOOL)application:(UIApplication *)application
//   openURL:(NSURL *)url
//   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [RCTLinkingManager application:application openURL:url options:options];
//}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}


- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler { return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler]; }




- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}

// --- Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {

  // --- Retrieve information from your voip push payload
  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  NSString *handle = payload.dictionaryPayload[@"handle"];
  NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"];

  // --- this is optional, only required if you want to call `completion()` on the js side
  [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];

  // --- Process the received push
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];

  // --- You should make sure to report to callkit BEFORE execute `completion()`
//  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:false localizedCallerName:callerName fromPushKit: YES payload:nil];
  
  [RNCallKeep reportNewIncomingCall: uuid
                               handle: handle
                           handleType: @"generic"
                             hasVideo: NO
                  localizedCallerName: callerName
                      supportsHolding: YES
                         supportsDTMF: YES
                     supportsGrouping: YES
                   supportsUngrouping: YES
                          fromPushKit: YES
                              payload: extra
                withCompletionHandler: completion];
  
  
  
  // --- You don't need to call it if you stored `completion()` and will call it on the js side.
  completion();
}

@end
