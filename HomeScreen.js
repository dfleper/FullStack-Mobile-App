import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { useRoute, useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const userId = route.params?.userId || null;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = "006ca1464b314490a199ef3299f58933"; // Reemplaza con tu clave de API
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`
        );
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={{ margin: 10 }}>
              {item.urlToImage && (
                <Image
                  source={{ uri: item.urlToImage }}
                  style={{ width: 360, height: 250, resizeMode: "cover" }}
                />
              )}
              <Text
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 18,
                  marginTop: 10,
                  fontWeight: "600",
                  textAlign: "auto",
                }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 16, marginTop: 10 }}>
                {item.description}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  writeData(
                    userId,
                    item.urlToImage,
                    item.title,
                    item.description
                  )
                }
                style={[styles.button, { backgroundColor: "#6792F090" }]}
              >
                <Text
                  style={{ fontSize: 17, fontWeight: "400", color: "white" }}
                >
                  Favourite
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favourites", { userId: userId })}
        style={[styles.button2, { backgroundColor: "#6792F090" }]}
      >
        <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
          Go Favourites News
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const writeData = async (userId, image, title, description) => {
  const db = getDatabase();
  if (userId) {
    const newsRef = ref(db, `favoritos/${userId}`);
    const newNewsRef = push(newsRef);
    const newNewsId = newNewsRef.key;

    set(newNewsRef, {
      id: newNewsId,
      image: image,
      title: title,
      description: description,
    });
    Alert.alert("¡Noticia Guardada!");
  } else {
    console.error("No se pudo obtener el userId.");
    Alert.alert("¡Ha Ocurrido un Error!");
  }
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#868AFF",
    borderWidth: 2,
  },
  button2: {
    width: 200,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#868AFF",
    borderWidth: 2,
  },
});

export default HomeScreen;
