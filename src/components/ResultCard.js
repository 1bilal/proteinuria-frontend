import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultCard = ({ result }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.result}>{result.result}</Text>
      <Text style={styles.date}>{new Date(result.timestamp).toLocaleString()}</Text>
      <Text style={styles.method}>Entry Method: {result.entry_method}</Text>
      {result.notes ? <Text style={styles.notes}>Notes: {result.notes}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  method: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
  },
});

export default ResultCard;
