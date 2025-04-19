import React, { useState } from "react";
import { View, Button, Image, Text, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { postTestResult } from "../services/authService";

const NewTestScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Camera access is needed to take the test strip photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "test.jpg",
      type: "image/jpeg",
    });
    formData.append("entry_method", "auto");

    try {
      setUploading(true);
      await postTestResult(formData, true);
      Alert.alert("Success", "Test submitted successfully");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Could not submit test");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Button title="Take a Photo of the Test Strip" onPress={pickImage} />

      {image && (
        <>
          <Image source={{ uri: image }} style={{ width: 300, height: 300, marginVertical: 20 }} />
          <Button title="Submit Test" onPress={handleSubmit} disabled={uploading} />
        </>
      )}

      {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
};

export default NewTestScreen;
