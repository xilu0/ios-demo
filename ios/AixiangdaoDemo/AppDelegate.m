/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

#import "RCTLinkingManager.h"
#import "AlipayModule.h"


//#import <CloudPushSDK/CloudPushSDK.h>

#import "SensorsAnalyticsSDK.h"

#ifdef DEBUG
#define SA_SERVER_URL @"<#【测试项目】数据接收地址#>"
#define SA_DEBUG_MODE SensorsAnalyticsDebugAndTrack
#else
#define SA_SERVER_URL @"<#【正式项目】数据接收地址#>"
#define SA_DEBUG_MODE SensorsAnalyticsDebugOff
#endif


@implementation AppDelegate
  
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
//  [CloudPushSDK sendNotificationAck:launchOptions];
  
  application.applicationIconBadgeNumber = 0;

  [self initSensorsAnalyticsWithLaunchOptions:launchOptions];
  
//  [self initCloudPush];
//  [self registerAPNS:application];
//  [self registerMessageReceive];

  NSLog(@"=====%@",NSHomeDirectory());
  NSURL *jsCodeLocation;
  
  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@" %@", name);
    }
  }

//#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

//#else
//    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index.ios" withExtension:@"jsbundle"];
//#endif
  

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"AixiangdaoDemo"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // [RNSplashScreen show]; // the code must last line
  return YES;
}

- (void)initSensorsAnalyticsWithLaunchOptions:(NSDictionary *)launchOptions {
  // 初始化 SDK
  [SensorsAnalyticsSDK sharedInstanceWithServerURL:SA_SERVER_URL
                                  andLaunchOptions:launchOptions
                                      andDebugMode:SA_DEBUG_MODE];
  // 设置公共属性
  [[SensorsAnalyticsSDK sharedInstance] registerSuperProperties:@{@"appName": @"HelloSensorsAnalytics"}];
  // 追踪激活事件，详见：https://sensorsdata.cn/manual/app_channel_tracking.html
  [[SensorsAnalyticsSDK sharedInstance] trackInstallation:@"AppInstall"];
  // 打开自动采集, 并指定追踪哪些 AutoTrack 事件
  [[SensorsAnalyticsSDK sharedInstance] enableAutoTrack:SensorsAnalyticsEventTypeAppStart|
   SensorsAnalyticsEventTypeAppEnd|
   SensorsAnalyticsEventTypeAppViewScreen|
   SensorsAnalyticsEventTypeAppClick];
  // 打通 App 与 H5，详见：https://sensorsdata.cn/manual/app_h5.html
  [[SensorsAnalyticsSDK sharedInstance] addWebViewUserAgentSensorsDataFlag];
}

- (void)initCloudPush {
  // SDK初始化
//  [CloudPushSDK asyncInit:@"24985477" appSecret:@"91c5b46c7f1081228385dfdcc59f29d3" callback:^(CloudPushCallbackResult *res) {
//    if (res.success) {
//      NSLog(@"Push SDK init success, deviceId: %@.", [CloudPushSDK getDeviceId]);
//    } else {
//      NSLog(@"Push SDK init failed, error: %@", res.error);
//    }
//  }];
}

/*
*  App处于启动状态时，通知打开回调
*/
- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo {
  NSLog(@"Receive one notification.");
  // 取得APNS通知内容
  NSDictionary *aps = [userInfo valueForKey:@"aps"];
  // 内容
  NSString *content = [aps valueForKey:@"alert"];
  // badge数量
  NSInteger badge = [[aps valueForKey:@"badge"] integerValue];
  // 播放声音
  NSString *sound = [aps valueForKey:@"sound"];
  // 取得Extras字段内容
  NSString *Extras = [userInfo valueForKey:@"Extras"]; //服务端中Extras字段，key是自己定义的
  NSLog(@"content = [%@], badge = [%ld], sound = [%@], Extras = [%@]", content, (long)badge, sound, Extras);
  // iOS badge 清0
  application.applicationIconBadgeNumber = 0;
  // 通知打开回执上报
  // [CloudPushSDK handleReceiveRemoteNotification:userInfo];(Deprecated from v1.8.1)
//  [CloudPushSDK sendNotificationAck:userInfo];
}


/**
 *    注册苹果推送，获取deviceToken用于推送
 *
 *    @param     application
 */
- (void)registerAPNS:(UIApplication *)application {
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    // iOS 8 Notifications
    [application registerUserNotificationSettings:
     [UIUserNotificationSettings settingsForTypes:
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge)
                                       categories:nil]];
    [application registerForRemoteNotifications];
  }
  else {
    // iOS < 8 Notifications
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
     (UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
  }
}
/*
 *  苹果推送注册成功回调，将苹果返回的deviceToken上传到CloudPush服务器
 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//  [CloudPushSDK registerDevice:deviceToken withCallback:^(CloudPushCallbackResult *res) {
//    if (res.success) {
//      NSLog(@"Register deviceToken success.");
//    } else {
//      NSLog(@"Register deviceToken failed, error: %@", res.error);
//    }
//  }];
}
/*
 *  苹果推送注册失败回调
 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError %@", error);
}

/**
 *    注册推送消息到来监听
 */
- (void)registerMessageReceive {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onMessageReceived:)
                                               name:@"CCPDidReceiveMessageNotification"
                                             object:nil];
}
/**
 *    处理到来推送消息
 *
 *    @param     notification
 */
- (void)onMessageReceived:(NSNotification *)notification {
//  CCPSysMessage *message = [notification object];
//  NSString *title = [[NSString alloc] initWithData:message.title encoding:NSUTF8StringEncoding];
//  NSString *body = [[NSString alloc] initWithData:message.body encoding:NSUTF8StringEncoding];
//  NSLog(@"Receive message title: %@, content: %@.", title, body);
}
  
  
//
//
  // ios 8.x or older
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
  {
    [AlipayModule handleCallback:url];

    return [RCTLinkingManager application:application openURL:url
                        sourceApplication:sourceApplication annotation:annotation];
  }
  
   // ios 9.0+
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
            options:(NSDictionary<NSString*, id> *)options
  {
    [AlipayModule handleCallback:url];

    return [RCTLinkingManager application:application openURL:url options:options];
  }


@end
