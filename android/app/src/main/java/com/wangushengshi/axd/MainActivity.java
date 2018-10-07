package com.wangushengshi.axd;

import com.facebook.react.ReactActivity;

import android.os.Bundle; // here
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here

import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "AixiangdaoDemo";
    }

    // @Override  
    // protected ReactActivityDelegate createReactActivityDelegate() {  
    //     return new ReactActivityDelegate(this, getMainComponentName()) {  
    //         @Nullable  
    //         @Override  
    //         protected Bundle getLaunchOptions() {  
    //             Bundle bundle = new Bundle();  
    //             bundle.putInt("Android_SDK_INT", Build.VERSION.SDK_INT);  
    //             return bundle;  
    //         }  
    //     };  
    // }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);

    }

    // ...other code


}
