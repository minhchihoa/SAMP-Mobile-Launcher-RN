import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { styles } from './LeaderboardStyle';
import axios from 'axios';
import { scale } from '../../helpers/demensions';

const URL_BASE = 'http://gtasan.vn/Top';

type LeaderboardItem = {
    username: string;
    value: string | number;
    rank: number;
};

type LeaderboardType = 'level' | 'money' | 'priceooc';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const LeaderboardModal = React.forwardRef<BottomSheetModal, any>((props, ref) => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('level');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{[key in LeaderboardType]: LeaderboardItem[]}>({
      level: [],
      money: [],
      priceooc: []
  });
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  const snapPoints = useMemo(() => ['85%'], []);

  const fetchData = async (type: LeaderboardType) => {
      setLoading(true);
      setError(null);
      try {
          // Map type to URL path component
          let path = 'Level';
          if (type === 'money') path = 'Money';
          if (type === 'priceooc') path = 'PriceOOC';
          
          const url = `${URL_BASE}/${path}`;
          console.log(`Fetching leaderboard: ${url}`);
          const res = await axios.get(url, {
              headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
          });
          
          const html = res.data;
          let items: LeaderboardItem[] = [];

          if (typeof html === 'string') {
              // Parse Top 3 Cards
              // Regex to find top cards: class="top-card rank-X" ... player-name ... player-stat
              const topCardRegex = /class="top-card\s+rank-(\d+)"[\s\S]*?class="player-name"[^>]*>\s*<a[^>]*>([^<]+)<\/a>[\s\S]*?class="player-stat"[^>]*>(?:[^<]*<img[^>]+alt="([^"]+)"|([^<]+))/g;
              
              let match;
              while ((match = topCardRegex.exec(html)) !== null) {
                  const rank = parseInt(match[1]);
                  const username = match[2].trim();
                  let valueRaw = match[3] || match[4] || "0"; // match[3] is alt, match[4] is text
                  valueRaw = valueRaw.trim();
                  
                  // Clean value
                  // Handle format "240.000 SAD" -> "240000"
                  let value = valueRaw.replace(/Level\s*/i, '')
                                      .replace(/SAD/g, '')
                                      .replace(/\./g, '') // Remove dots (thousand separators)
                                      .replace(/[$,]/g, '')
                                      .trim();
                  
                  items.push({
                      rank,
                      username,
                      value: parseInt(value) || 0
                  });
              }

              // Parse List Items
              // Regex to find list items: class="ranking-item" ... item-rank ... item-name ... item-stat
              const listItemRegex = /class="ranking-item"[\s\S]*?class="item-rank">#?(\d+)<\/div>[\s\S]*?class="item-name"[^>]*>([^<]+)<\/a>[\s\S]*?class="item-stat"[^>]*>(?:[^<]*<img[^>]+alt="([^"]+)"|([^<]+))/g;
              
              while ((match = listItemRegex.exec(html)) !== null) {
                  const rank = parseInt(match[1]);
                  const username = match[2].trim();
                  let valueRaw = match[3] || match[4] || "0";
                  valueRaw = valueRaw.trim();
                  
                  // Clean value
                  let value = valueRaw.replace(/Level\s*/i, '')
                                      .replace(/SAD/g, '')
                                      .replace(/\./g, '') // Remove dots (thousand separators)
                                      .replace(/[$,]/g, '')
                                      .trim();

                  items.push({
                      rank,
                      username,
                      value: parseInt(value) || 0
                  });
              }

              // Sort by rank just in case
              items.sort((a, b) => a.rank - b.rank);
              
          } else {
             console.warn("Unexpected response format:", typeof html);
          }

          setData(prev => ({...prev, [type]: items}));
      } catch (e) {
          console.error("Error fetching leaderboard:", e);
          setError("Không thể tải dữ liệu bảng xếp hạng.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData(activeTab);
  }, [activeTab]);

  const handleTabPress = (tab: LeaderboardType) => {
      setActiveTab(tab);
      // Scroll to the corresponding page
      let index = 0;
      if (tab === 'money') index = 1;
      if (tab === 'priceooc') index = 2;
      
      // Calculate offset. The container has padding, need to account for that?
      // The ScrollView is inside the container.
      // If we use pagingEnabled on ScrollView, the width is the view width.
      // We need to measure the width of the scrollview content container or just rely on screen width approximation if full width.
      // However, the modal has padding. Let's use a simpler approach: just update state and fetch.
      // But user wanted "swipe". So we need to sync scroll and tab.
      
      scrollRef.current?.scrollTo({ x: index * (SCREEN_WIDTH - scale(40)), animated: true });
  };

  const handleScroll = (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const width = event.nativeEvent.layoutMeasurement.width;
      const index = Math.round(offsetX / width);
      
      let newTab: LeaderboardType = 'level';
      if (index === 1) newTab = 'money';
      if (index === 2) newTab = 'priceooc';
      
      if (newTab !== activeTab) {
          setActiveTab(newTab);
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

  const renderList = (type: LeaderboardType) => {
      const list = data[type];
      
      if (loading && list.length === 0) {
          return <ActivityIndicator size="large" color="#FFD700" style={styles.loading} />;
      }
      
      if (error && list.length === 0) {
          return <Text style={styles.errorText}>{error}</Text>;
      }

      if (list.length === 0) {
           return <Text style={styles.errorText}>Chưa có dữ liệu.</Text>;
      }

      return (
          <View>
              <View style={[styles.row, styles.headerRow]}>
                  <Text style={[styles.rank, styles.headerText]}>#</Text>
                  <Text style={[styles.name, styles.headerText]}>Tên người chơi</Text>
                  <Text style={[styles.value, styles.headerText]}>
                      {type === 'level' ? 'Level' : type === 'money' ? 'Money' : 'Credits'}
                  </Text>
              </View>
              {list.slice(0, 10).map((item, index) => (
                  <View key={index} style={styles.row}>
                      <Text style={styles.rank}>{index + 1}</Text>
                      <Text style={styles.name}>{item.username || 'Unknown'}</Text>
                      <Text style={styles.value}>
                          {type === 'money' || type === 'priceooc' 
                            ? parseInt(String(item.value || 0)).toLocaleString() + (type === 'money' ? '$' : '')
                            : item.value}
                      </Text>
                  </View>
              ))}
          </View>
      );
  };

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
              <Text style={styles.title}>BẢNG XẾP HẠNG</Text>
              
              <View style={styles.tabs}>
                  <TouchableOpacity onPress={() => handleTabPress('level')} style={[styles.tab, activeTab === 'level' && styles.activeTab]}>
                      <Text style={[styles.tabText, activeTab === 'level' && styles.activeTabText]}>TOP LEVEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('money')} style={[styles.tab, activeTab === 'money' && styles.activeTab]}>
                      <Text style={[styles.tabText, activeTab === 'money' && styles.activeTabText]}>TOP MONEY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('priceooc')} style={[styles.tab, activeTab === 'priceooc' && styles.activeTab]}>
                      <Text style={[styles.tabText, activeTab === 'priceooc' && styles.activeTabText]}>TOP CREDITS</Text>
                  </TouchableOpacity>
              </View>

              <ScrollView 
                ref={scrollRef}
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                contentContainerStyle={{ width: (SCREEN_WIDTH - scale(40)) * 3 }}
              >
                  <View style={{ width: SCREEN_WIDTH - scale(40), paddingRight: 10 }}>
                      {renderList('level')}
                  </View>
                  <View style={{ width: SCREEN_WIDTH - scale(40), paddingRight: 10 }}>
                      {renderList('money')}
                  </View>
                  <View style={{ width: SCREEN_WIDTH - scale(40), paddingRight: 10 }}>
                      {renderList('priceooc')}
                  </View>
              </ScrollView>
          </View>
      </BottomSheetModal>
  );
});
