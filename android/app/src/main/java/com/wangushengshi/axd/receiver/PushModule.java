package com.wangushengshi.axd.receiver;


public class PushModule {//extends ReactContextBaseJavaModule {
//    private static final String TAG = "PushModule";
//    private static ReactContext context;
//    public PushModule(ReactApplicationContext reactContext) {
//        super(reactContext);
//        context = reactContext;
//    }
//    public static ReactContext getContext() {
//        return context;
//    }
//    public static void sendEvent(String eventName, @Nullable WritableMap params) {
//        if (context == null) {
//            Log.i(TAG, "reactContext==null");
//        }else{
//            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                    .emit(eventName, params);
//        }
//    }
//    //模块名，在JavaScript中调用相关方法时需要首先引入MPush模块
//    @Override
//    public String getName() {
//        return "MPush";
//    }
//    @ReactMethod
//    public void getDeviceId(Callback callback) {
//        callback.invoke(PushServiceFactory.getCloudPushService().getDeviceId());
//    }
//    @ReactMethod
//    public void bindAccount(String account, final Callback callback) {
//        PushServiceFactory.getCloudPushService().bindAccount(account, new CommonCallback() {
//            @Override
//            public void onSuccess(String s) {
//                callback.invoke("bind account success");
//            }
//            @Override
//            public void onFailed(String s, String s1) {
//                callback.invoke("bind account failed. errorCode:" + s + ", errorMsg:" + s1);
//            }
//        });
//    }

}
