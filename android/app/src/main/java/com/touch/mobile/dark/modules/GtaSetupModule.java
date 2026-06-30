package com.touch.mobile.dark.modules;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.touch.mobile.dark.MainGTA;

public class GtaSetupModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context = getReactApplicationContext();

    GtaSetupModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void startGame(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("Error", "Activity is null");
                return;
            }

            Intent intent = new Intent(context, MainGTA.class);
            intent.putExtras(activity.getIntent());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            activity.finish();

        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @ReactMethod
    public void checkStoragePermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                promise.resolve(Environment.isExternalStorageManager());
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @ReactMethod
    public void requestStoragePermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Activity activity = getCurrentActivity();
                if (activity == null) {
                    promise.reject("Activity is null", "Activity is null");
                    return;
                }
                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.addCategory("android.intent.category.DEFAULT");
                intent.setData(Uri.parse(String.format("package:%s", context.getPackageName())));
                activity.startActivityForResult(intent, 5000);
                promise.resolve(true);
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "GtaSetupModule";
    }
}
