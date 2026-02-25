import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../helpers/demensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: '#1A1A1A',
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    textTransform: 'uppercase',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    backgroundColor: '#333',
    borderRadius: scale(10),
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    borderRadius: scale(8),
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(12),
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    paddingBottom: verticalScale(30),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    backgroundColor: '#333',
    borderRadius: scale(8),
    marginBottom: verticalScale(10),
  },
  rank: {
    width: scale(30),
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#FFD700',
  },
  name: {
    flex: 1,
    fontSize: scale(16),
    color: '#FFF',
    fontWeight: '500',
  },
  value: {
    fontSize: scale(16),
    color: '#4CD964', // Green for money/values
    fontWeight: 'bold',
  },
  headerRow: {
    backgroundColor: 'transparent',
    marginBottom: verticalScale(5),
    paddingVertical: verticalScale(5),
  },
  headerText: {
    color: '#AAA',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  loading: {
    marginTop: verticalScale(20),
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});
