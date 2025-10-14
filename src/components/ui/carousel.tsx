import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type CarouselListItemProps = {
  id: string;
  component: React.ReactNode;
};

type CarouselContext = {
  data: CarouselListItemProps[];
  page: number;
  onPageChange: (page: number) => void;
  containerWidth: number;
};

const CarouselContext = React.createContext<CarouselContext | null>(null);

type CarouselProps = React.ComponentPropsWithRef<typeof View> & {
  data: CarouselListItemProps[];
};

const carouselStyles = StyleSheet.create({
  carousel: {
    flex: 1,
    width: '100%',
  },
});

const Carousel = ({ data, onLayout: onLayoutProp, style, ...props }: CarouselProps) => {
  const [page, setPage] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    onLayoutProp?.(event);
  };

  return (
    <CarouselContext.Provider value={{ data, page, onPageChange: setPage, containerWidth }}>
      <View style={[carouselStyles.carousel, style]} onLayout={onLayout} {...props} />
    </CarouselContext.Provider>
  );
};

function useCarouselContext() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel compound components cannot be rendered outside the Carousel component');
  }
  return context;
}

type CarouselListProps = Omit<
  React.ComponentPropsWithRef<typeof FlatList<CarouselListItemProps>>,
  'data' | 'renderItem' | 'keyExtractor'
>;

const CarouselList = ({ ...props }: CarouselListProps) => {
  const { data, onPageChange } = useCarouselContext();

  const renderItem: ListRenderItem<CarouselListItemProps> = ({ item }) =>
    item.component ? <>{item.component}</> : null;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.round(offsetX / pageWidth);

    if (onPageChange) {
      onPageChange(currentIndex);
    }
  };

  return (
    <FlatList<CarouselListItemProps>
      {...props}
      data={data}
      horizontal
      pagingEnabled
      scrollEventThrottle={500}
      maxToRenderPerBatch={2}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onMomentumScrollEnd={handleMomentumScrollEnd}
    />
  );
};

const carouselItemStyles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flex: 1,
    height: 'auto',
    justifyContent: 'center',
  },
});

const CarouselItem = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { containerWidth } = useCarouselContext();
  return <View style={[carouselItemStyles.item, { width: containerWidth }, style]} {...props} />;
};

const carouselPaginationStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    pagination: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
      justifyContent: 'flex-start',
    },
    paginationDot: {
      backgroundColor: colors.border,
      borderRadius: sizes.radius.default,
      height: sizes.dimension.xs / 2.8,
      width: sizes.dimension.sm / 1.2,
    },
    paginationDotActive: {
      backgroundColor: colors.primary,
    },
  });

const CarouselPagination = ({
  style,
  itemStyle,
  ...props
}: React.ComponentPropsWithRef<typeof View> & { itemStyle?: StyleProp<ViewStyle> }) => {
  const styles = useStyles(carouselPaginationStyles);
  const { data, page } = useCarouselContext();

  const animations = useRef<Animated.Value[]>(data.map((_, i) => new Animated.Value(i === page ? 1 : 0))).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === page ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  }, [page, animations]);

  return (
    <View style={[styles.pagination, style]} {...props}>
      {data.map((_, index) => {
        const scale = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        const opacity = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              itemStyle,
              index === page && styles.paginationDotActive,
              {
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};
export { Carousel, CarouselList, CarouselItem, CarouselPagination };
