#include <jni.h>
#include <string>
#include <vector>
#include <iomanip>
#include <sstream>

// Obfuscated Salt components to avoid simple string search
const char p1[] = "GSVN_";
const char p2[] = "MOBILE_";
const char p3[] = "SECURE_";
const char p4[] = "2024_";
const char p5[] = "SALT_KEY";

std::string getSalt() {
    return std::string(p1) + std::string(p2) + std::string(p3) + std::string(p4) + std::string(p5);
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_touch_mobile_dark_modules_SecurityUtils_nativeGenerateToken(
        JNIEnv* env,
        jclass clazz,
        jstring playerName,
        jstring appSignature) {

    if (playerName == NULL || appSignature == NULL) {
         return env->NewStringUTF("000000");
    }

    const char *nameChars = env->GetStringUTFChars(playerName, 0);
    const char *sigChars = env->GetStringUTFChars(appSignature, 0);

    std::string name(nameChars);
    std::string sig(sigChars);
    std::string salt = getSalt();

    std::string input = name + sig + salt;

    // Use Java's MessageDigest via JNI to avoid embedding full MD5 implementation
    // The security gain here is that the SALT construction and the logic flow are in native code
    jclass mdClass = env->FindClass("java/security/MessageDigest");
    jmethodID getInstance = env->GetStaticMethodID(mdClass, "getInstance", "(Ljava/lang/String;)Ljava/security/MessageDigest;");
    jobject md5 = env->CallStaticObjectMethod(mdClass, getInstance, env->NewStringUTF("MD5"));

    jmethodID digest = env->GetMethodID(mdClass, "digest", "([B)[B");
    
    jbyteArray inputBytes = env->NewByteArray(input.length());
    env->SetByteArrayRegion(inputBytes, 0, input.length(), (jbyte*)input.c_str());

    jbyteArray hashBytes = (jbyteArray)env->CallObjectMethod(md5, digest, inputBytes);

    // Convert to Hex String
    jsize length = env->GetArrayLength(hashBytes);
    jbyte* hashData = env->GetByteArrayElements(hashBytes, 0);

    std::stringstream ss;
    for (int i = 0; i < length; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)(hashData[i] & 0xff);
    }

    std::string fullHash = ss.str();
    std::string token = fullHash.substr(0, 6); // Take first 6 chars

    env->ReleaseByteArrayElements(hashBytes, hashData, 0);
    env->ReleaseStringUTFChars(playerName, nameChars);
    env->ReleaseStringUTFChars(appSignature, sigChars);

    return env->NewStringUTF(token.c_str());
}
