import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, Text } from 'react-native';
import { WIDTH, HEIGHT } from '../../helpers/demensions';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectArticles } from '../../selectors/articleSelectors';
import { CardItem } from './CardItem/CardItem';
import { styles } from './CardsStyle';
import { ArticleType } from '../../services/article.service';

export const Cards = () => {
  const articles = useAppSelector(selectArticles);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const CARD_HEIGHT = HEIGHT - 180; // Full screen minus header/tabs

  const hasArticles = articles.length > 0;

  const onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  }, []);

  const renderItem = ({ item }: { item: ArticleType }) => {
    return (
      <View style={{ width: WIDTH, height: CARD_HEIGHT }}>
         <CardItem {...item} />
      </View>
    );
  };
  
  // Custom Pagination
  const Pagination = () => {
      if (articles.length <= 1) return null;
      return (
          <View style={paginationStyles.container}>
              {articles.map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                        paginationStyles.dot, 
                        { backgroundColor: i === activeIndex ? '#6b8afd' : 'rgba(107, 138, 253, 0.4)', width: i === activeIndex ? 20 : 8 }
                    ]} 
                  />
              ))}
          </View>
      )
  }

  return (
    <View style={[styles.container, { height: CARD_HEIGHT }]}>
        {!hasArticles ? (
          <View style={{ width: WIDTH, height: CARD_HEIGHT }}>
            <CardItem
                title="Không thể tải tin tức"
                image=""
                slug=""
                description=""
                created_at="Sự cố kết nối internet"
            />
          </View>
        ) : (
          <View style={{ position: 'relative', height: CARD_HEIGHT }}>
             <FlatList
                ref={flatListRef}
                data={articles}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                onMomentumScrollEnd={onMomentumScrollEnd}
                scrollEventThrottle={16}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
             />
             <Pagination />
          </View>
        )}
    </View>
  );
};

const paginationStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    }
});