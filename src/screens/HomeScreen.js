import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ResultCard from "../components/ResultCard"; // adjust path if needed

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                if (!token) return;
        
                const authHeaders = { Authorization: `Token ${token}` };
        
                const userResponse = await axios.get("http://192.168.33.199:8000/api/user/", {
                    headers: authHeaders,
                });
        
                const resultsResponse = await axios.get("http://192.168.33.199:8000/api/test-results/", {
                    headers: authHeaders,
                });
        
                setUser(userResponse.data);
                setTestResults(resultsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        

        fetchData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("auth_token");
        navigation.replace("Login");
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome, {user?.first_name}!</Text>

            <Button title="New Test (Camera)" onPress={() => navigation.navigate("NewTest")} />
            <View style={{ marginVertical: 8 }} />
            <Button title="Submit Test Result (Manual)" onPress={() => navigation.navigate("SubmitResult")} />

            <Text style={styles.subheader}>Your Test Results:</Text>
            {testResults.length === 0 ? (
                <Text>No test results yet.</Text>
            ) : (
                <FlatList
                    data={testResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ResultCard result={item} />}
                />
            )}

            <View style={{ marginTop: 20 }} />
            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subheader: {
        fontSize: 20,
        marginTop: 24,
        marginBottom: 8,
    },
});

export default HomeScreen;
