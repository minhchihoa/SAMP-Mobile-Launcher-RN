package com.touch.mobile.dark.gui;

import android.annotation.SuppressLint;
import android.app.Activity;

import com.touch.mobile.dark.R;
import com.touch.mobile.dark.gui.adapters.DialogMenuAdapter;
import com.touch.mobile.dark.gui.models.DataDialogMenu;
import com.touch.mobile.dark.gui.util.Utils;
import com.nvidia.devtech.NvEventQueueActivity;

import android.content.Context;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import java.io.InputStream;
import org.json.JSONArray;
import org.json.JSONObject;

public class Menu {
    public View mRootView;
    public Activity activity;
    public LinearLayout menu_layout;
    public TextView menuTitle;
    private final Animation anim;
    private int index = -1;
    private final ArrayList<DataDialogMenu> dataDialogMenuArrayList = new ArrayList<>();

    @SuppressLint("InflateParams")
    public Menu(Activity aactivity) {
        activity = aactivity;
        anim = AnimationUtils.loadAnimation(aactivity, R.anim.button_click);
        menu_layout = aactivity.findViewById(R.id.main_menu_layout_new_layout);
        aactivity.findViewById(R.id.br_menu_close_new).setOnClickListener(view -> {
            close();
        });
        this.mRootView = ((LayoutInflater) aactivity.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.menu_dialog_layout, null, false);
        Utils.HideLayout(menu_layout,false);
    }

    public void Update(boolean z) {
        RecyclerView recyclerView = activity.findViewById(R.id.br_rec_view_menu);
        /*if (this.index == -1) {
            TransitionManager.beginDelayedTransition(recyclerView);
        }*/
        this.index = -1;
        this.menuTitle = activity.findViewById(R.id.br_menu_title);
        if (!z) {
            setMenu();
            this.menuTitle.setText("Hành động");
            setDataInRecyclerView((dataDialogMenu, view) -> {
                index = dataDialogMenu.getId();
                String cmd = dataDialogMenu.getCommand();
                view.startAnimation(anim);
                new Handler().postDelayed(() -> {
                    if (index == 3) {
                        Update(true);
                    } else {
                        try {
                            if (cmd != null && !cmd.isEmpty()) {
                                NvEventQueueActivity.getInstance().sendCommand(cmd.getBytes("windows-1251"));
                            } else {
                                NvEventQueueActivity.getInstance().sendRPC(1, String.valueOf(index).getBytes("windows-1251"), index);
                            }
//                            Toast.makeText(activity, String.valueOf(index), Toast.LENGTH_SHORT).show();
                            close();
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        }
                    }
                }, 300);
            }, this.dataDialogMenuArrayList, recyclerView, mRootView, 4);
            return;
        }
        setDialogMenu();
        this.menuTitle.setText("Giao tiếp");
        setDataInRecyclerView((dataDialogMenu, view) -> {
            index = dataDialogMenu.getId();
            String cmd = dataDialogMenu.getCommand();
            view.startAnimation(anim);
            new Handler().postDelayed(() -> {
                if (index == 13) {
                    Update(false);
                } else {
                    try {
                        if (cmd != null && !cmd.isEmpty()) {
                            NvEventQueueActivity.getInstance().sendCommand(cmd.getBytes("windows-1251"));
                        } else {
                            NvEventQueueActivity.getInstance().sendRPC(1, String.valueOf(index).getBytes("windows-1251"), index);
                        }
                        close();
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }

            }, 300);
        }, this.dataDialogMenuArrayList, recyclerView, mRootView, 3);
    }

    public void ShowMenu()
    {
        Update(false);
        Utils.ShowLayout(menu_layout, true);
    }

    private void setMenu() {
        this.dataDialogMenuArrayList.clear();
        
        // Load config from assets
        try {
            InputStream is = activity.getAssets().open("data/command_buttons.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, "UTF-8");
            JSONArray array = new JSONArray(json);
            
            // Default mappings if not in JSON (fallback)
            boolean foundConfig = false;
            
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                if (obj.has("menu_id")) {
                    int id = obj.getInt("menu_id");
                    String title = obj.getString("title");
                    String image = obj.getString("image");
                    String command = obj.optString("command", "");
                    boolean enable = obj.optBoolean("enable", true);
                    
                    if (enable) {
                        int resId = activity.getResources().getIdentifier(image.replace(".png", ""), "drawable", activity.getPackageName());
                        if (resId != 0) {
                            this.dataDialogMenuArrayList.add(new DataDialogMenu(id, resId, title, command));
                            foundConfig = true;
                        }
                    }
                }
            }

            if (!foundConfig) {
                // Fallback to default hardcoded items if no menu_id items found in JSON
                loadDefaultMenu();
            }
        } catch (Exception e) {
            e.printStackTrace();
            loadDefaultMenu();
        }
    }

    private void loadDefaultMenu() {
        this.dataDialogMenuArrayList.add(new DataDialogMenu(398, R.drawable.br_menu_compass, "Bản đồ"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(1, R.drawable.br_menu_taxi, "Gọi Taxi"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(2, R.drawable.br_menu_menu, "Menu"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(3, R.drawable.br_menu_chat, "Giao tiếp"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(4, R.drawable.br_menu_bag, "Túi đồ"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(5, R.drawable.br_menu_anim, "Cử chỉ"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(6, R.drawable.br_menu_ruble, "Cửa hàng"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(7, R.drawable.br_menu_car, "Xe cộ"));
    }

    private void setDialogMenu() {
        this.dataDialogMenuArrayList.clear();
        
        // Load config from assets for sub-menu
        try {
            InputStream is = activity.getAssets().open("data/command_buttons.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, "UTF-8");
            JSONArray array = new JSONArray(json);
            
            boolean foundConfig = false;
            
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                if (obj.has("submenu_id")) {
                    int id = obj.getInt("submenu_id");
                    String title = obj.getString("title");
                    String image = obj.getString("image");
                    String command = obj.optString("command", "");
                    boolean enable = obj.optBoolean("enable", true);
                    
                    if (enable) {
                        int resId = activity.getResources().getIdentifier(image.replace(".png", ""), "drawable", activity.getPackageName());
                        if (resId != 0) {
                            this.dataDialogMenuArrayList.add(new DataDialogMenu(id, resId, title, command));
                            foundConfig = true;
                        }
                    }
                }
            }

            if (!foundConfig) {
                loadDefaultDialogMenu();
            }
        } catch (Exception e) {
            e.printStackTrace();
            loadDefaultDialogMenu();
        }
    }

    private void loadDefaultDialogMenu() {
        this.dataDialogMenuArrayList.add(new DataDialogMenu(8, R.drawable.menu_passport, "Đưa hộ chiếu"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(9, R.drawable.menu_med, "Đưa hồ sơ bệnh án"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(10, R.drawable.menu_paper, "Đưa giấy phép"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(11, R.drawable.menu_lic, "Đưa giấy tờ xe"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(12, R.drawable.menu_exchange, "Giao dịch"));
        this.dataDialogMenuArrayList.add(new DataDialogMenu(13, R.drawable.menu_back, "Quay lại"));
    }

    private void setDataInRecyclerView(DialogMenuAdapter.OnUserClickListener onUserClickListener, ArrayList<DataDialogMenu> arrayList, RecyclerView recyclerView, final View view, int i) {
        DialogMenuAdapter dialogMenuAdapter = new DialogMenuAdapter(arrayList, onUserClickListener);
        recyclerView.setLayoutManager(new GridLayoutManager(view.getContext(), i) {
            @Override
            public boolean checkLayoutParams(RecyclerView.LayoutParams layoutParams) {
                float f = 30.0f / view.getResources().getDisplayMetrics().density;
                int i2 = (int) f;
                layoutParams.setMarginStart(i2);
                layoutParams.setMarginEnd(i2);
                layoutParams.setMargins(0, i2, 0, 0);
                layoutParams.width = (int) (((float) (getWidth() / getSpanCount())) - f);
                return true;
            }
        });
        recyclerView.setAdapter(dialogMenuAdapter);
    }

    public void close() {
        Utils.HideLayout(menu_layout, true);
        NvEventQueueActivity.getInstance().togglePlayer(0);
    }
}