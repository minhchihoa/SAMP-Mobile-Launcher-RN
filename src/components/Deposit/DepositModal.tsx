import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { styles } from './DepositStyle';
import axios from 'axios';
import { scale, verticalScale } from '../../helpers/demensions';

const URL_DEPOSIT_API = 'http://gtasan.vn/mobile/news/api_deposit.php';

export const DepositModal = React.forwardRef<BottomSheetModal, any>((props, ref) => {
  const [tab, setTab] = useState<'card' | 'transfer'>('card');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<any>(null);

  // Form State
  const [username, setUsername] = useState('');
  const [telco, setTelco] = useState('');
  const [amount, setAmount] = useState('');
  const [serial, setSerial] = useState('');
  const [code, setCode] = useState('');

  const snapPoints = useMemo(() => ['85%'], []);

  const fetchInfo = async () => {
      try {
          const res = await axios.get(`${URL_DEPOSIT_API}?action=get_info`);
          setInfo(res.data);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
      fetchInfo();
  }, []);

  const handleDeposit = async () => {
      if (!username || !telco || !amount || !serial || !code) {
          Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
          return;
      }
      setLoading(true);
      try {
          const res = await axios.post(`${URL_DEPOSIT_API}?action=deposit_card`, {
              username, telco, amount, serial, code
          });
          if (res.data.success) {
              Alert.alert("Thành công", res.data.success);
              setSerial('');
              setCode('');
          } else {
              Alert.alert("Thất bại", res.data.error || "Lỗi không xác định");
          }
      } catch (e) {
          Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
      } finally {
          setLoading(false);
      }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#1A1A1A' }}
        handleIndicatorStyle={{ backgroundColor: '#FFD700' }}
      >
          <View style={styles.container}>
              <Text style={styles.title}>NẠP TIỀN TÀI KHOẢN</Text>
              
              <View style={styles.tabs}>
                  <TouchableOpacity onPress={() => setTab('card')} style={[styles.tab, tab === 'card' && styles.activeTab]}>
                      <Text style={[styles.tabText, tab === 'card' && styles.activeTabText]}>THẺ CÀO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTab('transfer')} style={[styles.tab, tab === 'transfer' && styles.activeTab]}>
                      <Text style={[styles.tabText, tab === 'transfer' && styles.activeTabText]}>CHUYỂN KHOẢN</Text>
                  </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.content}>
                  {tab === 'card' ? (
                      <View style={styles.form}>
                          <Text style={styles.label}>Tên tài khoản:</Text>
                          <TextInput 
                              style={styles.input} 
                              placeholder="Nhập tên tài khoản game..." 
                              placeholderTextColor="#666"
                              value={username}
                              onChangeText={setUsername}
                          />

                          <Text style={styles.label}>Loại thẻ:</Text>
                          <View style={styles.telcoContainer}>
                              {['VIETTEL', 'VINAPHONE', 'MOBIFONE', 'VIETNAMOBILE'].map(t => (
                                  <TouchableOpacity key={t} onPress={() => setTelco(t)} style={[styles.telcoBtn, telco === t && styles.activeTelco]}>
                                      <Text style={[styles.telcoText, telco === t && styles.activeTelcoText]}>{t}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>

                          <Text style={styles.label}>Mệnh giá:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: verticalScale(15) }}>
                              {['10000', '20000', '50000', '100000', '200000', '500000'].map(a => (
                                  <TouchableOpacity key={a} onPress={() => setAmount(a)} style={[styles.amountBtn, amount === a && styles.activeAmount]}>
                                      <Text style={[styles.amountText, amount === a && styles.activeAmountText]}>{parseInt(a).toLocaleString()}đ</Text>
                                  </TouchableOpacity>
                              ))}
                          </ScrollView>

                          <Text style={styles.label}>Số Seri:</Text>
                          <TextInput 
                              style={styles.input} 
                              placeholder="Nhập số seri..." 
                              placeholderTextColor="#666"
                              value={serial}
                              onChangeText={setSerial}
                          />

                          <Text style={styles.label}>Mã thẻ:</Text>
                          <TextInput 
                              style={styles.input} 
                              placeholder="Nhập mã thẻ..." 
                              placeholderTextColor="#666"
                              value={code}
                              onChangeText={setCode}
                          />

                          <TouchableOpacity onPress={handleDeposit} style={styles.submitBtn} disabled={loading}>
                              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>NẠP THẺ NGAY</Text>}
                          </TouchableOpacity>
                          
                          <Text style={styles.note}>* Vui lòng kiểm tra kỹ mệnh giá và thông tin trước khi nạp.</Text>
                      </View>
                  ) : (
                      <View style={styles.infoContainer}>
                          <Text style={styles.infoTitle}>THÔNG TIN CHUYỂN KHOẢN</Text>
                          
                          <View style={styles.bankBox}>
                              <Text style={styles.bankName}>MOMO</Text>
                              <Text style={styles.bankInfo}>SĐT: <Text style={styles.highlight}>{info?.momo_phone || 'Đang tải...'}</Text></Text>
                              <Text style={styles.bankInfo}>Chủ TK: <Text style={styles.highlight}>{info?.momo_owner || 'Đang tải...'}</Text></Text>
                          </View>

                          <View style={styles.bankBox}>
                              <Text style={styles.bankName}>ACB (Á Châu)</Text>
                              <Text style={styles.bankInfo}>STK: <Text style={styles.highlight}>{info?.acb_account || '19446451'}</Text></Text>
                              <Text style={styles.bankInfo}>Chủ TK: <Text style={styles.highlight}>{info?.acb_owner || info?.momo_owner || 'Đang tải...'}</Text></Text>
                          </View>

                          <View style={styles.noteBox}>
                              <Text style={styles.noteTitle}>NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC):</Text>
                              <TextInput 
                                  style={[styles.input, { textAlign: 'center', fontWeight: 'bold', fontSize: scale(16), color: '#FFD700' }]} 
                                  placeholder="Nhập tên tài khoản của bạn..." 
                                  placeholderTextColor="#666"
                                  value={username}
                                  onChangeText={setUsername}
                              />
                              <Text style={styles.noteText}>Vui lòng nhập chính xác TÊN TÀI KHOẢN GAME của bạn vào nội dung chuyển khoản để được cộng tiền tự động.</Text>
                          </View>
                      </View>
                  )}
              </ScrollView>
          </View>
      </BottomSheetModal>
  );
});
