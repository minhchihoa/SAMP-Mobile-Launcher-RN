import { LINK_SITE_NEWS, LINK_SITE_STORAGE } from '@env';
import React, { useCallback } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { NoImage } from '../../../assets/images';
import { substringStr } from '../../../features/substring-str';
import { ArticleType } from '../../../services/article.service';
import { styles } from './CardItemStyles';

export const CardItem = (article: ArticleType) => {
  const rawImage = article.image || '';
  const imageUri = rawImage.trim();
  const hasImage = imageUri.length > 0;
  
  const rawLink = article.link || '';
  const linkUri = rawLink.trim();
  const hasLink = linkUri.length > 0;

  const onPressArticleHandler = useCallback(async () => {
    if (hasLink) {
      await Linking.openURL(linkUri);
    }
  }, [hasLink, linkUri]);

  const ContainerComponent = hasLink ? TouchableOpacity : View;

  return (
    <View style={[styles.container]}>
      <ContainerComponent
        style={styles.cover}
        onPress={hasLink ? onPressArticleHandler : undefined}
        activeOpacity={hasLink ? 0.8 : 1}
      >
        {hasImage && (
          <FastImage
            style={[styles.image]}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: imageUri.startsWith('http') ? imageUri : `${LINK_SITE_STORAGE ?? ''}${imageUri}`,
              priority: FastImage.priority.normal,
            }}
          />
        )}
        {!hasImage && (
          <Image source={NoImage} style={[styles.image]} />
        )}
      </ContainerComponent>
      <LinearGradient
        style={styles.content}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.2 }}
        colors={['#00000000', '#000000ff']}>
        {hasLink ? (
          <TouchableOpacity onPress={onPressArticleHandler}>
            <Text style={styles.title}>{substringStr(article.title, 40)}</Text>
            <Text style={styles.created}>{article.created_at}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.title}>{substringStr(article.title, 40)}</Text>
            <Text style={styles.created}>{article.created_at}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};
