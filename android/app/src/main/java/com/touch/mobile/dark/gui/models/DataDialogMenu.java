package com.touch.mobile.dark.gui.models;

public class DataDialogMenu {
    private int id;
    private int imgDrawableButton;
    private String nameButton;

    private String command;

    public DataDialogMenu(int i, int i2, String str) {
        this.id = i;
        this.imgDrawableButton = i2;
        this.nameButton = str;
        this.command = "";
    }

    public DataDialogMenu(int i, int i2, String str, String command) {
        this.id = i;
        this.imgDrawableButton = i2;
        this.nameButton = str;
        this.command = command;
    }

    public String getCommand() {
        return this.command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public int getImgDrawableButton() {
        return this.imgDrawableButton;
    }

    public void setImgDrawableButton(int i) {
        this.imgDrawableButton = i;
    }

    public String getNameButton() {
        return this.nameButton;
    }

    public void setNameButton(String str) {
        this.nameButton = str;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int i) {
        this.id = i;
    }
}
