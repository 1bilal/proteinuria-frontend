import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                if (!token) return;

                const userResponse = await axios.get("http://192.168.244.41:8000/api/user/", {
                    headers: { Authorization: `Token ${token}` },
                });

                const resultsResponse = await axios.get("http://192.168.244.41:8000/api/test-results/", {
                    headers: { Authorization: `Token ${token}` },
                });

                setUser(userResponse.data);
                setTestResults(resultsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Welcome, {user?.first_name}!</Text>

            <Button title="New Test" onPress={() => navigation.navigate("NewTest")} />

            <Text style={{ fontSize: 20, marginTop: 20 }}>Your Test Results:</Text>
            {testResults.length === 0 ? (
                <Text>No test results yet.</Text>
            ) : (
                <FlatList
                    data={testResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Text>
                            {item.result} - {new Date(item.timestamp).toLocaleString()}
                        </Text>
                    )}
                />
            )}

            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
};

export default HomeScreen;
