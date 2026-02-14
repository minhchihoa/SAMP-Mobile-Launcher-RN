import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { scale } from '../helpers/demensions';

export const styles = StyleSheet.create({
  setting: {
    paddingHorizontal: verticalScale(5),
    marginBottom: verticalScale(10),
  },
  settingWrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'transparent',
    marginBottom: verticalScale(15),
  },
  loading: {
    backgroundColor: '#000000c9',
    zIndex: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
  },
  body: {
    paddingHorizontal: verticalScale(10),
  },
  title: {
    color: '#FFD700', // Gold
    fontSize: scale(26),
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  switch: {
    marginTop: verticalScale(10),
    padding: verticalScale(15),
    marginBottom: verticalScale(15),
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  range: {
    marginVertical: verticalScale(10),
    padding: verticalScale(15),
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
      color: '#FFD700',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: verticalScale(10),
      textTransform: 'uppercase',
  },
  graphicContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(20),
      gap: 10,
  },
  btnOption: {
      flex: 1,
      paddingVertical: verticalScale(10),
      backgroundColor: '#333',
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#555',
  },
  btnOptionActive: {
      backgroundColor: '#FFD700', // Gold background
      borderColor: '#FFD700',
  },
  btnText: {
      color: '#ccc',
      fontWeight: '600',
      fontSize: 14,
  },
  btnTextActive: {
      color: '#000', // Black text on gold
      fontWeight: 'bold',
  },
  button: {
    marginTop: verticalScale(15),
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});
