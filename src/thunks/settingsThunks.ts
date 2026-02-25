import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { setModeType, setSettings } from '../actions/settingsActions';
import { FilePath } from '../features/fileManager';
import { parseINIString, stringifyIni } from '../helpers';
import { AppThunk } from '../store/store';

type SettingType = {
  client: {
    name: string;
    host?: string;
    ip?: string;
    port?: number;
  };
  gui: {
    fps: number;
    ChatMaxMessages: number;
    fpscounter: number;
    androidKeyboard: number;
    graphic: number;
  };
  server: {
    serverid: number;
  };
  launcher: {
    localhost: number;
    skip: number;
  };
};

const defaultSettings: SettingType = {
  client: {
    name: '', // Changed from 'NewPlayer' to empty string
  },
  gui: {
    fps: 40,
    ChatMaxMessages: 6,
    fpscounter: 0,
    androidKeyboard: 0,
    graphic: 0,
  },
  server: {
    serverid: -1,
  },
  launcher: {
    localhost: 0,
    skip: 0,
  },
};

const settingsPath = FilePath.getPathDirSetting();
const sampDirPath = settingsPath.substring(0, settingsPath.lastIndexOf('/'));

export const fetchInitialSettings = (): AppThunk => async dispatch => {
  try {
    const dirExists = await RNFS.exists(sampDirPath);
    if (!dirExists) {
      await RNFS.mkdir(sampDirPath);
    }

    const fileExists = await RNFS.exists(settingsPath);
    let settings: SettingType;

    if (fileExists) {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      settings = parseINIString(res) as SettingType;
    } else {
      settings = defaultSettings;
      await RNFS.writeFile(settingsPath, stringifyIni(settings), 'utf8');
    }

    dispatch(
      setSettings({
        userName: settings.client?.name ?? defaultSettings.client.name,
        fpsLimit: Number(settings.gui?.fps ?? defaultSettings.gui.fps),
        serverid: Number(settings.server?.serverid ?? defaultSettings.server.serverid),
        pageSize: Number(settings.gui?.ChatMaxMessages ?? defaultSettings.gui.ChatMaxMessages),
        graphic: Number(settings.gui?.graphic ?? defaultSettings.gui.graphic),
        fpscounter: Number(settings.gui?.fpscounter ?? defaultSettings.gui.fpscounter),
        androidKeyboard: Number(settings.gui?.androidKeyboard ?? defaultSettings.gui.androidKeyboard),
        localhost: Number(settings.launcher?.localhost ?? defaultSettings.launcher.localhost),
        skip: Number(settings.launcher?.skip ?? defaultSettings.launcher.skip),
      }),
    );
  } catch (errors) {
    console.error("Error in fetchInitialSettings: ", errors);
    // In case of error, dispatch default settings to avoid crash
    dispatch(
      setSettings({
        userName: defaultSettings.client.name,
        fpsLimit: defaultSettings.gui.fps,
        serverid: defaultSettings.server.serverid,
        pageSize: defaultSettings.gui.ChatMaxMessages,
        graphic: defaultSettings.gui.graphic,
        fpscounter: defaultSettings.gui.fpscounter,
        androidKeyboard: defaultSettings.gui.androidKeyboard,
        localhost: defaultSettings.launcher.localhost,
        skip: defaultSettings.launcher.skip,
      }),
    );
  }
};

export const fetchUserNameSetting =
  (userName: string): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        client: { ...resParse.client, name: userName },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const writeConnectionSettings =
  (ip: string, port: number): AppThunk =>
  async () => {
    try {
      console.log('[Settings] writeConnectionSettings start', { ip, port });
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        client: { ...resParse.client, host: ip, ip, port },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
      console.log('[Settings] writeConnectionSettings done');
    } catch (error) {
      console.log('[Settings] Error writing connection settings: ', error);
    }
  };

export const fetchFpsSetting =
  (value: number): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = { ...resParse, gui: { ...resParse.gui, fps: value } };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const fetchPageSizeSetting =
  (value: number): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        gui: { ...resParse.gui, ChatMaxMessages: value },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const fetchGraphicSetting =
  (value: number): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        gui: { ...resParse.gui, graphic: value },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const fetchFPSSetting =
  (value: boolean): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        gui: { ...resParse.gui, fpscounter: value ? 1 : 0 },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const fetchKeyboardSetting = (value: boolean): AppThunk => async dispatch => {
  try {
    const fileExists = await RNFS.exists(settingsPath);
    let settings: SettingType;
    if (fileExists) {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      settings = parseINIString(res) as SettingType;
    } else {
      settings = defaultSettings;
    }
    settings.gui.androidKeyboard = value ? 1 : 0;
    await RNFS.writeFile(settingsPath, stringifyIni(settings), 'utf8');
  } catch (error) {
    console.error(error);
  }
};

export const fetchServerIdSetting =
  (value: number): AppThunk =>
  async () => {
    try {
      const res = await RNFS.readFile(settingsPath, 'utf8');
      let resParse = parseINIString(res) as SettingType;

      resParse = {
        ...resParse,
        server: { ...resParse.server, serverid: value ? 1 : 0 },
      };

      await RNFS.writeFile(settingsPath, stringifyIni(resParse), 'utf8');
    } catch (error) {}
  };

export const fetchModeSetting =
  (value: number): AppThunk =>
  async dispatch => {
    try {
      await AsyncStorage.setItem('modeType', `${value}`);
      dispatch(setModeType(value));
    } catch (error) {
      dispatch(setModeType(0));
    }
  };

export const fetchModeInverseSetting =
  (): AppThunk => async (dispatch, state) => {
    const value = state().settings.modeType ? 0 : 1;

    try {
      await AsyncStorage.setItem('modeType', `${value}`);
      dispatch(setModeType(value));
    } catch (error) {
      dispatch(setModeType(0));
    }
  };
