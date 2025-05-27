import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { icons } from '@/constants/icons';
import { fetchSaveMovies } from '@/services/appwrite';
import { useRouter } from 'expo-router';

export interface Saved {
  $id: string;
  title: string;
  poster_url: string;
  movie_id: string;
}

const Saved = () => {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<Saved[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      const movies = await fetchSaveMovies();
      setSavedMovies(movies);
    };
    loadSaved();
  }, []);

  if (savedMovies.length === 0) {
    return (
      <View className="flex-1 bg-primary px-10">
        <View className="flex flex-1 flex-col items-center justify-center gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-base text-gray-500">Save</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary px-5">
      <Text className="mb-5 mt-28 text-lg font-bold text-white">
        Saved Movies
      </Text>
      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-5 w-[30%]"
            onPress={() =>
              router.push({
                pathname: '/movies/[id]',
                params: { id: item.movie_id },
              })
            }
          >
            <Image
              source={{ uri: item.poster_url }}
              className="h-48 w-full rounded-xl"
              resizeMode="cover"
            />
            <Text
              className="mt-2 text-sm font-bold text-white"
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 20,
        }}
        className="mt-2 pb-32"
        scrollEnabled={true}
      />
    </View>
  );
};

export default Saved;
