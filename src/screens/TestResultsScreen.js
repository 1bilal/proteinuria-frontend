import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getTestResults } from './src/services/authService';  // Correct import path

const TestResultsScreen = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const data = await getTestResults();
        setTestResults(data);
      } catch (err) {
        setError('Failed to load test results.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>Test Results</Text>
      <FlatList
        data={testResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.result}</Text>
            <Text>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TestResultsScreen;
