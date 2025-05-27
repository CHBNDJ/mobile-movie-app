import { Client, Databases, Query, ID, Account } from 'appwrite';
import 'react-native-url-polyfill/auto';
import Saved from '@/app/(tabs)/saved';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client); // Your project ID
const account = new Account(client); // For user authentication

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    console.log('Updating search count for:', query, movie);
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query),
    ]);

    console.log('📄 Existing documents:', result.documents);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      console.log('📝 Updating existing document:', existingMovie);

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
          title: movie.title,
        },
      );
    } else {
      console.log('➕ Creating new document');
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
    console.log('✅ updateSearchCount complete');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('count'),
      Query.limit(5),
    ]);

    console.log('📄 Trending movies:', result.documents);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveMovie = async (movie: Movie) => {
  try {
    const existing = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal('movie_id', movie.id.toString())],
    );

    console.log('📄 Existing saved movies:', existing.documents);

    if (existing.documents.length > 0) {
      console.log('📝 Movie already saved:', existing.documents[0]);
      return;
    }

    await database.createDocument(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      ID.unique(),
      {
        movie_id: movie.id.toString(),
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const fetchSaveMovies = async (): Promise<(typeof Saved)[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [],
    );
    return result.documents as unknown as (typeof Saved)[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const isMovieSaved = async (movieId: string): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal('movie_id', movieId)],
    );
    return result.documents.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeSavedMovie = async (movieId: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal('movie_id', movieId)],
    );

    if (result.documents.length > 0) {
      const documentId = result.documents[0].$id;
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        documentId,
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await account.createEmailSession(email, password);
    const user = await account.get();
    return user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const logOut = async () => {
  try {
    await account.deleteSession('current');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
