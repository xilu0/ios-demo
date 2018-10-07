package com.wangushengshi.axd;

import android.app.Application;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.ReactApplication;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import dk.madslee.imageCapInsets.RCTImageCapInsetPackage;

import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;
import com.yunpeng.alipay.AlipayPackage;
import com.theweflex.react.WeChatPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.json.JSONObject;

import me.listenzz.modal.TranslucentModalReactPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.hzl.pulltorefresh.RefreshReactPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

import com.toast.RCTToastPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private static final String TAG = "MainApplication";
  private  ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return true;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            		new RNInstabugReactnativePackage.Builder("abb9e942e4bdae10f56d7cff3006fb00",MainApplication.this)
							.setInvocationEvent("shake")
							.setPrimaryColor("#1D82DC")
							.setFloatingEdge("left")
							.setFloatingButtonOffsetFromTop(250)
							.build(),
            new RCTCapturePackage(),
            new LinearGradientPackage(),
            new ReactVideoPackage(),
            new RCTImageCapInsetPackage(),
            new AlipayPackage(),
            new WeChatPackage(),
            new SplashScreenReactPackage(),
            new TranslucentModalReactPackage(),
            new FastImageViewPackage(),
            new RefreshReactPackage(),
            new AMapGeolocationPackage(),
            new RNI18nPackage(),
            new RCTToastPackage(),
            new PickerPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            ///new PushPackage(),
            new WeChatPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };
  public void setReactNativeHost(ReactNativeHost reactNativeHost) {
    mReactNativeHost = reactNativeHost;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //initPushService(this);
    initSensorsDataSDK(this);
  }
  /**
   * 初始化云推送通道
   * @param applicationContext
   */
  /*private void initPushService(Context applicationContext) {
    PushServiceFactory.init(applicationContext);
    final CloudPushService pushService = PushServiceFactory.getCloudPushService();
    pushService.register(applicationContext, new CommonCallback() {
      @Override
      public void onSuccess(String response) {
        Log.i(TAG, "init cloudchannel success");
        //setConsoleText("init cloudchannel success");
        WritableMap params = Arguments.createMap();
        params.putBoolean("success", true);
        //PushModule.sendEvent("onInit", params);
        System.out.println("设备id:"+PushServiceFactory.getCloudPushService().getDeviceId());
      }
      @Override
      public void onFailed(String errorCode, String errorMessage) {
        Log.e(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
        //setConsoleText("init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
        WritableMap params = Arguments.createMap();
        params.putBoolean("success", false);
        params.putString("errorMsg", "errorCode:" + errorCode + ". errorMsg:" + errorMessage);
        //PushModule.sendEvent("onInit", params);
      }
    });
    NotificationConfig.initNotificationChannel(this);
  }*/

  // ...other code

  // debug 模式的数据接收地址 （测试，测试项目）
  final static String SA_SERVER_URL_DEBUG = "【测试项目】数据接收地址";

  // release 模式的数据接收地址（发版，正式项目）
  final static String SA_SERVER_URL_RELEASE = "【正式项目】数据接收地址";

  // SDK Debug 模式选项
  //   SensorsDataAPI.DebugMode.DEBUG_OFF - 关闭 Debug 模式
  //   SensorsDataAPI.DebugMode.DEBUG_ONLY - 打开 Debug 模式，校验数据，但不进行数据导入
  //   SensorsDataAPI.DebugMode.DEBUG_AND_TRACK - 打开 Debug 模式，校验数据，并将数据导入到 Sensors Analytics 中
  // TODO 注意！请不要在正式发布的 App 中使用 DEBUG_AND_TRACK /DEBUG_ONLY 模式！ 请使用 DEBUG_OFF 模式！！！

  // debug 时，初始化 SDK 使用测试项目数据接收 URL 、使用 DEBUG_AND_TRACK 模式；release 时，初始化 SDK 使用正式项目数据接收 URL 、使用 DEBUG_OFF 模式。
  private boolean isDebugMode;


  private void initSensorsDataSDK(Context context) {
    try {
      // 初始化 SDK
      SensorsDataAPI.sharedInstance(
              context,                                                                                  // 传入 Context
              (isDebugMode = isDebugMode(context)) ? SA_SERVER_URL_DEBUG : SA_SERVER_URL_RELEASE,       // 数据接收的 URL
              isDebugMode ? SensorsDataAPI.DebugMode.DEBUG_AND_TRACK : SensorsDataAPI.DebugMode.DEBUG_OFF); // Debug 模式选项

      // 初始化SDK后，获取应用名称设置为公共属性
      JSONObject properties = new JSONObject();
      properties.put("app_name", getAppName(context));
      SensorsDataAPI.sharedInstance().registerSuperProperties(properties);

      // 打开自动采集, 并指定追踪哪些 AutoTrack 事件
      List<SensorsDataAPI.AutoTrackEventType> eventTypeList = new ArrayList<>();
      // $AppStart
      eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_START);
      // $AppEnd
      eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_END);
      // $AppViewScreen
      
      
      eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_VIEW_SCREEN);
      // $AppClick
      eventTypeList.add(SensorsDataAPI.AutoTrackEventType.APP_CLICK);
      SensorsDataAPI.sharedInstance().enableAutoTrack(eventTypeList);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * @param context App 的 Context
   *                获取应用程序名称
   */
  public static String getAppName(Context context) {
    try {
      PackageManager packageManager = context.getPackageManager();
      PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
      int labelRes = packageInfo.applicationInfo.labelRes;
      return context.getResources().getString(labelRes);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
      return null;
    }
  }


  /**
   * @param context App 的 Context
   * @return debug return true,release return false
   * 用于判断是 debug 包，还是 relase 包
   */
  public static boolean isDebugMode(Context context) {
    try {
      ApplicationInfo info = context.getApplicationInfo();
      return (info.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }
}
