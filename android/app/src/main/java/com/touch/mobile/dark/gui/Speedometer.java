package com.touch.mobile.dark.gui;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.widget.*;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.touch.mobile.dark.R;
import com.touch.mobile.dark.gui.util.Utils;
import com.touch.mobile.dark.gui.util.SeekArc;
import java.util.Formatter;

public class Speedometer {
    public Activity activity;
    public TextView mCarHP;
    public ImageView mEngine;
    public TextView mFuel;
    public ConstraintLayout mInputLayout;
    public ImageView mLight;
    public ImageView mLock;
    public TextView mMileage;
    public TextView mSpeed;
    public SeekArc mSpeedLine;

    public Speedometer(Activity activity){
        ConstraintLayout relativeLayout = activity.findViewById(R.id.speedometer);
        mInputLayout = relativeLayout;
        mSpeed = activity.findViewById(R.id.speed_text);
        mFuel = activity.findViewById(R.id.speed_fuel_text);
        mCarHP = activity.findViewById(R.id.speed_car_hp_text);
        mMileage = activity.findViewById(R.id.textView2);
        mSpeedLine = activity.findViewById(R.id.speed_line);
        mEngine = activity.findViewById(R.id.speed_engine_ico);
        mLock = activity.findViewById(R.id.speed_lock_ico);
        // Utils.HideLayout(relativeLayout, false);
        loadConfig();
    }

    private void loadConfig() {
        try {
            java.io.InputStream is = activity.getAssets().open("data/command_buttons.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, "UTF-8");
            org.json.JSONArray array = new org.json.JSONArray(json);

            for (int i = 0; i < array.length(); i++) {
                org.json.JSONObject obj = array.getJSONObject(i);
                if (obj.has("view_id")) {
                    String viewIdStr = obj.getString("view_id");
                    String command = obj.optString("command");
                    boolean enable = obj.optBoolean("enable", true);

                    if (viewIdStr.equals("speed_engine_ico") && mEngine != null) {
                        mEngine.setVisibility(enable ? android.view.View.VISIBLE : android.view.View.GONE);
                        // Force command to /car engine to ensure correct behavior
                        String finalCommand = "/car engine";
                        if (enable) {
                            mEngine.setOnClickListener(v -> {
                                try {
                                    // Add null terminator to prevent JNI string corruption (garbage at end)
                                    String cmdToSend = finalCommand + "\u0000";
                                    com.nvidia.devtech.NvEventQueueActivity.getInstance().sendCommand(cmdToSend.getBytes("windows-1251"));
                                } catch (Exception e) {}
                            });
                        }
                    } else if (viewIdStr.equals("speed_lock_ico") && mLock != null) {
                        mLock.setVisibility(enable ? android.view.View.VISIBLE : android.view.View.GONE);
                        if (enable && !command.isEmpty()) {
                            mLock.setOnClickListener(v -> {
                                try {
                                    String cmdToSend = command + "\u0000";
                                    com.nvidia.devtech.NvEventQueueActivity.getInstance().sendCommand(cmdToSend.getBytes("windows-1251"));
                                } catch (Exception e) {}
                            });
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void UpdateSpeedInfo(int speed, int fuel, int hp, int mileage, int engine, int light, int belt, int lock){
        // Speedometer disabled
    }

    public void ShowSpeed() {
        Utils.ShowLayout(mInputLayout, false);
        // Utils.HideLayout(mInputLayout, false);
    }

    public void HideSpeed() {
        Utils.HideLayout(mInputLayout, false);
    }
}