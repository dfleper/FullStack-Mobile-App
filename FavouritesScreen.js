import React, { useEffect, useState } from "react";
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
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useRoute } from "@react-navigation/native";

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const userId = route.params?.userId || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("userId Favourites:", userId);
        if (userId) {
          const db = getDatabase();
          const favouritesRef = ref(db, `favoritos/${userId}`);

          // Escuchamos cambios en la base de datos
          onValue(favouritesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              // Convertimos el objeto en un array y ordenamos por ID
              const favouritesArray = Object.values(data).sort(
                (a, b) => a.id - b.id
              );
              setFavourites(favouritesArray);
            } else {
              setFavourites([]);
            }
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error obteniendo el userId:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Función para borrar un favorito por ID
  const deleteFavourite = async (id) => {
    try {
      const db = getDatabase();
      const favouritesRef = ref(db, `favoritos/${userId}/${id}`);

      // Borrar el nodo del favorito
      await remove(favouritesRef);
      Alert.alert("¡Noticia Borrada!");
    } catch (error) {
      console.error("Error al borrar el favorito:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ margin: 10 }}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
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
              <Text style={{ fontSize: 14, marginTop: 10, color: "gray" }}>
                ID: {item.id}
              </Text>
              <TouchableOpacity
                onPress={() => deleteFavourite(item.id)}
                style={[styles.button2, { backgroundColor: "#6792F090" }]}
              >
                <Text
                  style={{ fontSize: 17, fontWeight: "400", color: "white" }}
                >
                  Delete Favourite
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FavouritesScreen;
