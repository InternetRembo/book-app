import React, { useEffect } from 'react';
import {
  View, Image, StyleSheet, LayoutAnimation,
} from 'react-native';
import Animated, {
  withTiming, interpolate, Extrapolate,
  useDerivedValue, useAnimatedStyle, useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';

import Text from './Text';

// single book component
function Book({ book, scrollX, index }) {
  const { margin, normalize } = useTheme();
  const BOOKW = normalize(120, 150);
  const BOOKH = BOOKW * 1.5;
  const position = useDerivedValue(() => (index + 0.00001) * (BOOKW + margin) - scrollX.value);
  const inputRange = [-BOOKW, 0, BOOKW, BOOKW * 3];
  const loaded = useSharedValue(0);

  // slide books in
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    loaded.value = withTiming(1);
  }, []);

  // animated styles
  const anims = {
    book: useAnimatedStyle(() => ({
      transform: [
        { perspective: 800 },
        { scale: interpolate(position.value, inputRange, [0.9, 1, 1, 1], Extrapolate.CLAMP) },
        { rotateY: `${interpolate(position.value, inputRange, [60, 0, 0, 0], Extrapolate.CLAMP)}deg` },
        {
          translateX: scrollX.value
            ? interpolate(position.value, inputRange, [BOOKW / 3, 0, 0, 0], 'clamp')
            : interpolate(loaded.value, [0, 1], [index * BOOKW, 0], 'clamp'),
        },
      ],
    })),
  };

  // non animated styles
  const styles = StyleSheet.create({
    imgBox: {
      marginRight: margin,
      borderRadius: 10,
      shadowRadius: 6,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 6 },
    },
    bookImg: {
      width: BOOKW,
      height: BOOKH,
      borderRadius: 10,
    },
    bookText: {
      width: BOOKW,
      marginRight: margin,
      marginTop: margin / 2,
    },
  });

  return (
    <Animated.View style={anims.book}>
      <SharedElement id={book.bookId}>
        <View style={styles.imgBox}>
          <Image style={styles.bookImg} source={{ uri: book.imageUrl }} />
        </View>
      </SharedElement>
      <Text size={13} numberOfLines={1} center style={styles.bookText}>
        {book.author.name}
      </Text>
    </Animated.View>
  );
}

export default React.memo(Book);
