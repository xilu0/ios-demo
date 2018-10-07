package com.wangushengshi.axd.receiver;


public class MessageNotificationReceiver {//extends MessageReceiver {
//    // 消息接收部分的LOG_TAG
//    public static final String REC_TAG = "receiver";
//
//    @Override
//    public void onNotification(Context context, String title, String summary, Map<String, String> extraMap) {
//        // TODO 处理推送通知
//        Log.e("MyMessageReceiver", "Receive notification, title: " + title + ", summary: " + summary + ", extraMap: " + extraMap);
//        WritableMap params = Arguments.createMap();
//        params.putString("content", summary);
//        params.putString("title", title);
//        for (Map.Entry<String, String> entry: extraMap.entrySet()) {
//            params.putString(entry.getKey(), entry.getValue());
//        }
//        PushModule.sendEvent("onNotification", params);
//
//    }
//
//    @Override
//    public void onMessage(Context context, CPushMessage cPushMessage) {
//        Log.e("MyMessageReceiver", "onMessage, messageId: " + cPushMessage.getMessageId() + ", title: " + cPushMessage.getTitle() + ", content:" + cPushMessage.getContent());
//        WritableMap params = Arguments.createMap();
//        params.putString("messageId", cPushMessage.getMessageId());
//        params.putString("content", cPushMessage.getContent());
//        params.putString("title", cPushMessage.getTitle());
//        PushModule.sendEvent("onMessage", params);
//    }
//
//    @Override
//    public void onNotificationOpened(Context context, String title, String summary, String extraMap) {
//        Log.e("MyMessageReceiver", "onNotificationOpened, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap);
//        WritableMap params = Arguments.createMap();
//        params.putString("content", summary);
//        params.putString("title", title);
//        PushModule.sendEvent("onNotificationOpened", params);
//    }
//
//    @Override
//    protected void onNotificationClickedWithNoAction(Context context, String title, String summary, String extraMap) {
//        Log.e("MyMessageReceiver", "onNotificationClickedWithNoAction, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap);
//    }
//
//    @Override
//    protected void onNotificationReceivedInApp(Context context, String title, String summary, Map<String, String> extraMap, int openType, String openActivity, String openUrl) {
//        Log.e("MyMessageReceiver", "onNotificationReceivedInApp, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap + ", openType:" + openType + ", openActivity:" + openActivity + ", openUrl:" + openUrl);
//    }
//
//    @Override
//    protected void onNotificationRemoved(Context context, String messageId) {
//        Log.e("MyMessageReceiver", "onNotificationRemoved");
//        WritableMap params = Arguments.createMap();
//        params.putString("messageId", messageId);
//        PushModule.sendEvent("onNotificationRemoved", params);
//    }
}
