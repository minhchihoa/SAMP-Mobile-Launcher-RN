import { LINK_DISCORD, LINK_SITE, LINK_TIKTOK, LINK_FACEBOOK } from '@env';
import React, { useCallback } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  discordLinkIcon,
  logoLinkIcon,
  tiktokLinkIcon,
  fbLinkIcon,
} from './../../assets/icons';
import { styles } from './SocialStyle';

export const socials = [
  {
    title: 'Trang web',
    link: LINK_SITE,
    icon: logoLinkIcon,
  },
  {
    title: 'Facebook',
    link: LINK_FACEBOOK,
    icon: fbLinkIcon,
  },
  {
    title: 'Discord',
    link: LINK_DISCORD,
    icon: discordLinkIcon,
  },
  {
    title: 'TikTok',
    link: LINK_TIKTOK,
    icon: tiktokLinkIcon,
  },
];

export const Social = React.memo(() => {
  const onPressLinkHandler = useCallback(async (link: string) => {
    await Linking.openURL(link);
  }, []);

  return (
    <View style={styles.social}>
      <Text style={styles.title}>Mạng xã hội</Text>
      <View style={styles.body}>
        {socials.map((el, key) => (
          <LinearGradient
            key={el.title}
            style={[
              styles.case,
              key === socials.length - 1 ? { marginRight: 0 } : null,
            ]}
            start={{ x: 0.0, y: 0.0 }}
            colors={['#de73c526', '#4851a200']}>
            <TouchableOpacity
              style={styles.link}
              onPress={() => onPressLinkHandler(el.link)}>
              <Image style={styles.image} source={el.icon} />
              <Text style={styles.subtitle}>{el.title}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
});
