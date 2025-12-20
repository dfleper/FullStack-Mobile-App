import React, { useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebase-config";
import { getDatabase, ref, set, onValue } from "firebase/database";

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const uri = "https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg";
const profilePicture = "https://randomuser.me/api/portraits/women/21.jpg";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);

  const navigation = useNavigation();

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("¡Cuenta creada exitosamente!");
        Alert.alert("¡Cuenta creada exitosamente!");
      })
      .catch((error) => {
        console.log("Error al crear la cuenta:", error.message);
        Alert.alert("Ups, algo salió mal. Por favor, verifica tus datos.");
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("¡Inicio de sesión exitoso!");
        Alert.alert("¡Inicio de sesión exitoso!");
        const user = userCredential.user;
        navigation.navigate("Home", { userId: user.uid });
      })
      .catch((error) => {
        console.log("Error al iniciar sesión:", error.message);
        Alert.alert(
          "Oops, algo salió mal. Por favor, verifica tu email y password."
        );
      });
  };

  const handleClearFields = () => {
    console.log("Limpiando campos");
    setEmail("");
    setPassword("");
    setShowClearButton(false);
    console.log("Campos limpios:", email, password, showClearButton);
    Alert.alert("¡Felicidades, los Campos están Limpios!");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "purple",
          position: "absolute",
        }}
      ></View>
      <TouchableOpacity
        onPress={handleClearFields}
        style={[styles.clear, { backgroundColor: "#6792F090" }]}
      >
        <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
          Clear
        </Text>
      </TouchableOpacity>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "purple",
          top: 120,
          position: "absolute",
          transform: [{ rotate: "25deg" }],
        }}
      ></View>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "purple",
          bottom: 120,
          position: "absolute",
          borderRadius: 50,
          transform: [{ rotate: "50deg" }],
        }}
      ></View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BlurView intensity={90}>
          <View style={styles.login}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
            <View>
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                E-mail
              </Text>
              <TextInput
                onChangeText={(text) => {
                  setEmail(text);
                  setShowClearButton(text.length > 0);
                }}
                value={email}
                style={styles.input}
                placeholder="email"
              />
            </View>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                Password
              </Text>
              <TextInput
                onChangeText={(text) => {
                  setPassword(text);
                  setShowClearButton(text.length > 0);
                }}
                value={password}
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              onPress={handleSignIn}
              style={[styles.button, { backgroundColor: "#00CFEB90" }]}
            >
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreateAccount}
              style={[styles.button, { backgroundColor: "#6792F090" }]}
            >
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  login: {
    width: 350,
    height: 500,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    marginVertical: 30,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 1,
  },
  clear: {
    width: 250,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#868AFF",
    borderWidth: 2,
  },
});

export default LoginScreen;
