import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { images } from '@/constants/images';

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className="relative w-32 pl-5">
        <Image
          source={{ uri: poster_url }}
          className="h-48 w-32 rounded-lg"
          resizeMode="cover"
        />
        <View className="-left-1.2 absolute bottom-4 rounded-full px-2 py-1">
          <MaskedView
            maskElement={
              <Text className="text-5xl font-bold text-white">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>
        <Text
          className="mt-2 text-sm font-bold text-light-200"
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
