package com.touch.mobile.dark.modules;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

public class SecurityUtils {

    private static final String TAG = "SecurityUtils";

    static {
        try {
            System.loadLibrary("security");
        } catch (UnsatisfiedLinkError e) {
            Log.e(TAG, "Failed to load native library: security", e);
        }
    }

    // Native method declaration
    public static native String nativeGenerateToken(String playerName, String appSignature);

    public static String getAppSignature(Context context) {
        try {
            String signature = "";
            PackageInfo packageInfo;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNING_CERTIFICATES);
                if (packageInfo.signingInfo != null) {
                    if (packageInfo.signingInfo.hasMultipleSigners()) {
                        signature = signatureDigest(packageInfo.signingInfo.getApkContentsSigners()[0]);
                    } else {
                        signature = signatureDigest(packageInfo.signingInfo.getSigningCertificateHistory()[0]);
                    }
                }
            } else {
                packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNATURES);
                if (packageInfo.signatures != null && packageInfo.signatures.length > 0) {
                    signature = signatureDigest(packageInfo.signatures[0]);
                }
            }
            // Log the signature so the developer can copy it to their server
            Log.d(TAG, "APP_SIGNATURE: " + signature);
            return signature;
        } catch (Exception e) {
            Log.e(TAG, "Error getting app signature", e);
        }
        return "";
    }

    private static String signatureDigest(Signature sig) {
        byte[] signature = sig.toByteArray();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(signature);
            return bytesToHex(digest);
        } catch (Exception e) {
            Log.e(TAG, "Error digesting signature", e);
        }
        return "";
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public static String generateToken(String playerName, String appSignature) {
        try {
            return nativeGenerateToken(playerName, appSignature);
        } catch (UnsatisfiedLinkError e) {
            Log.e(TAG, "Error calling native generateToken", e);
            return "000000";
        }
    }

    public static void injectTokenToSettings(Context context, String settingsPath) {
        File file = new File(settingsPath);
        if (!file.exists()) {
            Log.e(TAG, "Settings file not found: " + settingsPath);
            return;
        }

        List<String> lines = new ArrayList<>();
        String playerName = "";
        boolean modified = false;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "Windows-1251"))) { // INI files often use Windows-1251
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().startsWith("name =") || line.trim().startsWith("name=")) {
                    String[] parts = line.split("=", 2);
                    if (parts.length > 1) {
                        playerName = parts[1].trim();
                        // Check length constraints (SA-MP max name length usually 24)
                        if (playerName.length() <= 24) {
                            lines.add("name = " + playerName);
                        } else {
                            // Name too long, ensure it's truncated or valid
                            Log.w(TAG, "Player name too long: " + playerName);
                            lines.add("name = " + playerName); 
                        }
                    } else {
                        lines.add(line);
                    }
                } else if (line.trim().startsWith("password =") || line.trim().startsWith("password=")) {
                    // Skip existing password line
                    continue; 
                } else {
                    lines.add(line);
                }
            }
            
            // Generate and inject token as password
            String appSignature = getAppSignature(context);
            // We need playerName to generate token
            if (!playerName.isEmpty()) {
                String token = generateToken(playerName, appSignature);
                lines.add("password = " + token);
                modified = true;
            }
            
        } catch (IOException e) {
            Log.e(TAG, "Error reading settings file", e);
            return;
        }

        if (modified) {
            try (BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "Windows-1251"))) {
                for (String line : lines) {
                    bw.write(line);
                    bw.newLine();
                }
            } catch (IOException e) {
                Log.e(TAG, "Error writing settings file", e);
            }
        }
    }
}
