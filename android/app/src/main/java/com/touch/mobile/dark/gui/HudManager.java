package com.touch.mobile.dark.gui;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.nvidia.devtech.NvEventQueueActivity;
import com.touch.mobile.dark.R;
import com.touch.mobile.dark.gui.util.Utils;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Formatter;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.InputStream;
import android.graphics.drawable.Drawable;

public class HudManager {
    public Activity activity;
    public ConstraintLayout hud_layout;

    public TextView hud_money;
    public TextView hud_credits;
    public TextView hud_ammo;
    public TextView hud_bonus_text;
    public TextView hud_name;
    public TextView hud_menu;

    public ImageView hud_weapon;

    public ImageView hud_inv;
    public ImageView hud_donate;
    public ImageView hud_bonus_img;

    public ArrayList<ImageView> hud_wanted;

    public ProgressBar progressHP;
    public ProgressBar progressArmor;
    public ProgressBar progressEat;

    private int indexInv = 4;
    
    // Cached objects for optimization
    private final DecimalFormat formatter;
    private final android.util.SparseIntArray weaponDrawableCache = new android.util.SparseIntArray();

    public HudManager(Activity aactivity) {
        activity = aactivity;
        
        // Initialize formatter once
        formatter = new DecimalFormat();
        DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance();
        symbols.setGroupingSeparator('.');
        formatter.setDecimalFormatSymbols(symbols);
        
        hud_layout = aactivity.findViewById(R.id.hud_main);
        hud_layout.setVisibility(View.GONE);

        progressArmor = aactivity.findViewById(R.id.hud_armor_pb);
        progressHP = aactivity.findViewById(R.id.hud_health_pb);
        progressEat = aactivity.findViewById(R.id.hud_eat);

        // Hide HUD elements as requested
        progressArmor.setVisibility(View.GONE);
        progressHP.setVisibility(View.GONE);
        progressEat.setVisibility(View.GONE);

        hud_money = aactivity.findViewById(R.id.hud_money);
        hud_credits = aactivity.findViewById(R.id.hud_credits);
        hud_ammo = aactivity.findViewById(R.id.hud_ammo);
        hud_ammo.setVisibility(View.GONE);
        hud_weapon = aactivity.findViewById(R.id.hud_weapon);
        hud_menu = aactivity.findViewById(R.id.hud_menu);
        hud_inv = aactivity.findViewById(R.id.hud_inv);
        hud_donate = aactivity.findViewById(R.id.hud_donate);
        hud_bonus_img = aactivity.findViewById(R.id.hud_bonus_img);
        hud_bonus_text = aactivity.findViewById(R.id.hud_bonus_text);
        hud_name = aactivity.findViewById(R.id.hud_name);

        hud_wanted = new ArrayList<>();
        hud_wanted.add(activity.findViewById(R.id.hud_star_1));
        hud_wanted.add(activity.findViewById(R.id.hud_star_2));
        hud_wanted.add(activity.findViewById(R.id.hud_star_3));
        hud_wanted.add(activity.findViewById(R.id.hud_star_4));
        hud_wanted.add(activity.findViewById(R.id.hud_star_5));
        hud_wanted.add(activity.findViewById(R.id.hud_star_6));
        hud_menu.setOnClickListener( view -> {
            NvEventQueueActivity.getInstance().showMenu();
            NvEventQueueActivity.getInstance().togglePlayer(1);
        });
        hud_inv.setOnClickListener(view -> {
            try {
                NvEventQueueActivity.getInstance().sendCommand("/tuido".getBytes("windows-1251"));
            } catch(Exception e) {}
        });

        loadCommandConfig();
    }

    private void loadCommandConfig() {
        try {
            InputStream is = activity.getAssets().open("data/command_buttons.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, "UTF-8");
            JSONArray array = new JSONArray(json);
            
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                if (obj.has("view_id")) {
                    String viewIdStr = obj.getString("view_id");
                    String command = obj.optString("command");
                    String image = obj.optString("image");
                    boolean enable = obj.optBoolean("enable", true);

                    int resId = activity.getResources().getIdentifier(viewIdStr, "id", activity.getPackageName());
                    if (resId != 0) {
                        View view = activity.findViewById(resId);
                        if (view != null) {
                            view.setVisibility(enable ? View.VISIBLE : View.GONE);
                            
                            // Force /car engine for the engine button
                            String finalCommand = viewIdStr.equals("speed_engine_ico") ? "/car engine" : command;

                            if (enable) {
                                if (!finalCommand.isEmpty()) {
                                    view.setOnClickListener(v -> {
                                        try {
                                            // Add null terminator to prevent JNI string corruption
                                            String cmdToSend = finalCommand + "\u0000";
                                            NvEventQueueActivity.getInstance().sendCommand(cmdToSend.getBytes("windows-1251"));
                                        } catch (Exception e) {}
                                    });
                                }

                                if (image != null && !image.isEmpty() && view instanceof ImageView) {
                                    try {
                                        InputStream ims = activity.getAssets().open("buttons/" + image);
                                        Drawable d = Drawable.createFromStream(ims, null);
                                        ((ImageView)view).setImageDrawable(d);
                                    } catch(Exception e) {
                                        // Ignore image load error
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("DefaultLocale")
    public void UpdateHudInfo(int health, int armour, int hunger, int weaponid, int ammo, int ammoinclip, int money, int wanted, int checkX2, String name, int id)
    {
        // Removed progress updates for deleted HUD elements
        // progressHP.setProgress(health);
        // progressArmor.setProgress(armour);
        // progressEat.setProgress(hunger);

        hud_money.setText(formatter.format(money));

        if(checkX2 > 1) {
            hud_bonus_img.setVisibility(View.VISIBLE);
            hud_bonus_text.setText(String.format("x%d", checkX2));
        }

        hud_name.setText(String.format("ID:%d %s", id, name));

        /*
        switch(weaponid) {
            case 16:
            case 17:
            case 18:
                hud_ammo.setText(String.format("%d", ammo));
                break;
            case 22:
            case 23:
                hud_ammo.setText(String.format("%d/%d", ammo + 17 - ammoinclip , ammoinclip));
                break;
            case 27:
            case 24:
                hud_ammo.setText(String.format("%d/%d", ammo + 7 - ammoinclip, ammoinclip));
                break;
            case 25:
            case 33:
            case 34:
            case 35:
            case 36:
            case 39:
                hud_ammo.setText(String.format("%d/%d", ammo, 1));
                break;
            case 26:
                hud_ammo.setText(String.format("%d/%d", ammo + 2 - ammoinclip, ammoinclip));
                break;
            case 29:
            case 30:
                hud_ammo.setText(String.format("%d/%d", ammo + 30 - ammoinclip, ammoinclip));
                break;
            case 28:
            case 32:
            case 31:
                hud_ammo.setText(String.format("%d/%d", ammo + 50 - ammoinclip, ammoinclip));
                break;
            case 37:
            case 38:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
                hud_ammo.setText(String.format("%d/%d", ammo + 366 - ammoinclip, ammoinclip));
                break;
            default:
                hud_ammo.setText(String.valueOf(' '));
        }
        */

        int d_id = weaponDrawableCache.get(weaponid, 0);
        if (d_id == 0) {
            d_id = activity.getResources().getIdentifier("weapon_" + weaponid, "drawable", activity.getPackageName());
            weaponDrawableCache.put(weaponid, d_id);
        }
        
        if (d_id != 0) {
            hud_weapon.setImageResource(d_id);
        }

        hud_weapon.setOnClickListener(v -> NvEventQueueActivity.getInstance().onWeaponChanged());
        if(wanted > 6) wanted = 6;
        for (int i2 = 0; i2 < wanted; i2++) {
            hud_wanted.get(i2).setBackgroundResource(R.drawable.ic_y_star);
        }

    }

    public void ShowHud()
    {
        Utils.ShowLayout(hud_layout, false);
    }

    public void HideHud()
    {
        Utils.HideLayout(hud_layout, false);
    }

    public void setCredits(int credits) {
        hud_credits.setText(formatter.format(credits));
    }

}
