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
    fontSize: scale(14),
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    paddingBottom: verticalScale(30),
  },
  form: {},
  label: {
    color: '#FFF',
    fontSize: scale(14),
    marginBottom: verticalScale(8),
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: scale(12),
    borderRadius: scale(8),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: '#444',
  },
  telcoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
    marginBottom: verticalScale(15),
  },
  telcoBtn: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    backgroundColor: '#333',
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: '#444',
  },
  activeTelco: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  telcoText: {
    color: '#FFF',
  },
  activeTelcoText: {
    color: '#000',
    fontWeight: 'bold',
  },
  amountBtn: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    backgroundColor: '#333',
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: '#444',
    marginRight: scale(10),
  },
  activeAmount: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  amountText: {
    color: '#FFF',
  },
  activeAmountText: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#FFD700',
    padding: scale(15),
    borderRadius: scale(10),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scale(16),
    textTransform: 'uppercase',
  },
  note: {
    color: '#AAA',
    fontSize: scale(12),
    marginTop: verticalScale(15),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoTitle: {
    color: '#FFF',
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
  },
  bankBox: {
    width: '100%',
    backgroundColor: '#333',
    padding: scale(15),
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  bankName: {
    color: '#FFD700',
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
  },
  bankInfo: {
    color: '#FFF',
    fontSize: scale(14),
    marginBottom: verticalScale(3),
  },
  highlight: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noteBox: {
    width: '100%',
    marginTop: verticalScale(10),
    padding: scale(15),
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  noteTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  noteText: {
    color: '#AAA',
    fontSize: scale(13),
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
});
