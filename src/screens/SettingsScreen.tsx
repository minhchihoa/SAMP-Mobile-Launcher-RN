import { APP_VERSION } from '@env';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import { setAlertUpdatingMode } from '../actions/alertActions';
import {
  setSettingFps,
  setSettingFpsCounter,
  setSettingGraphic,
  setSettingKeyboard,
  setSettingPageSize,
  setUserNameSetting,
} from '../actions/settingsActions';
import { MainContainer, RangeLauncher, SwitchLauncher } from '../components';
import { AlertUpdateMode } from '../components/AlertScreen/AlertUpdateMode';
import { InputLauncher } from '../components/InputLauncher/InputLauncher';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectModeType, selectSettings } from '../selectors/settingSelectors';
import { fetchInitialApp } from '../thunks/appThunks'; // Import fetchInitialApp
import {
  fetchFPSSetting,
  fetchFpsSetting,
  fetchGraphicSetting,
  fetchKeyboardSetting,
  fetchModeSetting,
  fetchPageSizeSetting,
  fetchUserNameSetting,
} from '../thunks/settingsThunks';
import * as Icons from './../assets/svg';
import { styles } from './../styles/SettingsStyle';
import { StackActions, useNavigation } from '@react-navigation/native';
import { navigationRef } from '../routers/RootNavigation';
import { setInitial } from '../actions/appActions';

export const SettingsScreen = React.memo(() => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const settings = useAppSelector(selectSettings);
  const settingMode = useAppSelector(selectModeType);
  const dispatch = useAppDispatch();

  const onEndEditingUserName = React.useCallback((e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const value = e.nativeEvent.text;
    dispatch(fetchUserNameSetting(value));
    dispatch(setUserNameSetting({ userName: value }));
  }, []);

  const onValueChangeFps = React.useCallback((e: number) => {
    dispatch(setSettingFps({ fpsLimit: Math.floor(e) }));
  }, []);

  const onSlidingCompleteFps = React.useCallback((e: number) => {
    dispatch(fetchFpsSetting(Math.floor(e)));
  }, []);

  const onValueChangePageSize = React.useCallback((e: number) => {
    dispatch(setSettingPageSize({ pageSize: Math.floor(e) }));
  }, []);

  const onSlidingCompletePageSize = React.useCallback((e: number) => {
    dispatch(fetchPageSizeSetting(Math.floor(e)));
  }, []);

  const onValueChangeSnow = React.useCallback(async (value: boolean) => {
    setIsLoading(true);
    await dispatch(fetchModeSetting(value ? 1 : 0));
    // Reset and re-check everything
    dispatch(setInitial({ initial: false }));
    navigationRef.current?.dispatch(StackActions.replace('Initiation'));
    setIsLoading(false);
  }, []);

  const onValueChangeGraphic = React.useCallback((value: number) => {
    dispatch(setSettingGraphic({ graphic: Math.floor(value) }));
  }, []);

  const onSlidingCompleteGraphic = React.useCallback((value: number) => {
    dispatch(fetchGraphicSetting(Math.floor(value)));
  }, []);

  const onValueChangeFPS = React.useCallback((value: boolean) => {
    dispatch(setSettingFpsCounter({ fpscounter: value ? 1 : 0 }));
    dispatch(fetchFPSSetting(value));
  }, []);

  const onValueChangeKeyboard = React.useCallback((value: boolean) => {
    dispatch(setSettingKeyboard({ androidKeyboard: value ? 1 : 0 }));
    dispatch(fetchKeyboardSetting(value));
  }, []);

  return (
    <>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'#228dff'} />
        </View>
      )}
      <MainContainer>
        <View style={styles.settingWrapper}>
          <View style={styles.setting}>
            <Text style={styles.title}>Cài đặt</Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={styles.body}>
                  <View>
                    <InputLauncher
                      value={settings.userName}
                      onEndEditing={onEndEditingUserName}
                      onChangeText={(text) => dispatch(setUserNameSetting({ userName: text }))}
                      placeholder="Nhập tên người chơi"
                    />
                  </View>

                  <View style={styles.switch}>
                    <SwitchLauncher
                      title="Chế độ tuyết rơi"
                      value={settingMode}
                      onValueChange={onValueChangeSnow}
                    />
                    <SwitchLauncher
                      title="Bộ đếm FPS"
                      value={settings.fpscounter}
                      onValueChange={onValueChangeFPS}
                    />
                    <SwitchLauncher
                      title="Bàn phím Android"
                      value={settings.androidKeyboard}
                      onValueChange={onValueChangeKeyboard}
                    />
                  </View>

                  <View style={styles.range}>
                    <Text style={styles.sectionTitle}>
                      Chất lượng đồ họa
                    </Text>
                    
                    <View style={styles.graphicContainer}>
                      {[0, 1, 2].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.btnOption,
                            settings.graphic === level && styles.btnOptionActive
                          ]}
                          onPress={() => {
                            onValueChangeGraphic(level);
                            onSlidingCompleteGraphic(level);
                          }}
                        >
                          <Text style={[
                            styles.btnText,
                            settings.graphic === level && styles.btnTextActive
                          ]}>
                            {level === 0 ? 'Thấp' : level === 1 ? 'Trung bình' : 'Cao'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <RangeLauncher
                      title="Giới hạn FPS"
                      range={settings.fpsLimit}
                      minimumValue={30}
                      maximumValue={90}
                      onValueChange={onValueChangeFps}
                      onSlidingComplete={onSlidingCompleteFps}
                    />
                    <RangeLauncher
                      title="Số dòng chat"
                      range={settings.pageSize}
                      minimumValue={1}
                      maximumValue={20}
                      onValueChange={onValueChangePageSize}
                      onSlidingComplete={onSlidingCompletePageSize}
                    />
                  </View>
                </View>
                <Text style={styles.version}>Phiên bản: {APP_VERSION}</Text>
              </ScrollView>
          </View>
        </View>
      </MainContainer>
    </>
  );
});
