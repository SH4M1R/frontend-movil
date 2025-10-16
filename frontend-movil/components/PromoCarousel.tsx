import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export type Item = {
    image?: any;
    title: string;
    description?: string
};

type Props = {
    items: Item[];
    autoplay?: boolean;
    autoplayInterval?: number;
    cardWithRatio?: number;
}

export default function PromoCarousel({
    items,
    autoplay = true,
    autoplayInterval = 3000,
    cardWithRatio = 0.7,
}: Props) {
    const flatRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    /*const cardWidth = Math.round(width * cardWithRatio);*/
    const cardWidth = width * 0.95; 


    useEffect(() => {
        if (!autoplay || items.length <= 1) return;
        const id = setInterval(() => {
            const next = (currentIndex + 1) % items.length;
            setCurrentIndex(next);
            flatRef.current?.scrollToIndex({ index: next, animated: true });
        }, autoplayInterval);
        return () => clearInterval(id);
    }, [currentIndex, autoplay, autoplayInterval, items.length]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
        setCurrentIndex(index);
    };

    const renderCard = ({ item }: { item: Item }) => (
        <Animated.View
            entering={FadeIn}
            className="bg-white rounded-2xl  mx-2 my-3 "
            style={{
                width: cardWidth,
                
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
            }}
        >

            {item.image && (
                <Image source={item.image} className="w-full h-40 rounded-lg mb-2" resizeMode="cover" />
            )}
            <Text className="text-blue-500 text-lg font-bold text-center">{item.title}</Text>
            {item.description ? (
                <Text className="text-gray-600 text-sm text-center mt-1">{item.description}</Text>
            ) : null}
        </Animated.View>
    );

    const renderDot = (index: number) => (
        <View
            key={`dot-${index}`}
            className={`w-2.5 h-2.5 rounded-full mx-1 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
    );


    return (
        <View className="py-2">
            <FlatList
                ref={flatRef}
                data={items}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => `promo-${i}`}
                renderItem={renderCard}
                onScroll={onScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={cardWidth }

            />

            <View className="flex-row justify-center items-center mt-3">
                {items.map((_, idx) => renderDot(idx))}
            </View>
        </View>
    )
}
