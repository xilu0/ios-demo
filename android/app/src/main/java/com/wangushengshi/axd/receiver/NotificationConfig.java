package com.wangushengshi.axd.receiver;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;


public class NotificationConfig {
    public static void initNotificationChannel(Context applicationContext) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager mNotificationManager = (NotificationManager) applicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
            try {
                InputStream open = applicationContext.getAssets().open("notificationChannel.config");
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(open));
                StringBuilder sb = new StringBuilder();
                String line = null;
                while ((line = bufferedReader.readLine()) != null) {
                    sb.append(line);
                }
                JSONArray jsonArray = new JSONArray(sb.toString());
                for (int i = 0; i < jsonArray.length(); i++) {
                    // 通知渠道的id
                    JSONObject jsonObject = (JSONObject) jsonArray.get(i);

                    String id = jsonObject.getString("id");
                    // 用户可以看到的通知渠道的名字.
                    CharSequence name = jsonObject.getString("channelName");
                    // 用户可以看到的通知渠道的描述
                    String description = jsonObject.getString("channelDescription");
                    int importance = NotificationManager.IMPORTANCE_HIGH;
                    NotificationChannel mChannel = new NotificationChannel(id, name, importance);
                    // 配置通知渠道的属性
                    mChannel.setDescription(description);
                    // 设置通知出现时的闪灯（如果 android 设备支持的话）
                    mChannel.enableLights(true);
                    mChannel.setLightColor(Color.RED);
                    // 设置通知出现时的震动（如果 android 设备支持的话）
                    mChannel.enableVibration(true);
                    mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
                    //最后在notificationmanager中创建该通知渠道
                    mNotificationManager.createNotificationChannel(mChannel);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }
}
