import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { postTestResult } from '../services/authService'; // Adjust path as needed

const SubmitResultScreen = () => {
  const [date, setDate] = useState(new Date());
  const [proteinLevel, setProteinLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!proteinLevel) {
      Alert.alert('Validation Error', 'Please select a protein level');
      return;
    }

    try {
      const payload = {
        result: proteinLevel, // Map proteinLevel to result
        entry_method: 'manual', // Add required entry_method field
        image: null, // Optional field, set to null for manual entry
        notes: notes,
      };
      const result = await postTestResult(payload);
      Alert.alert('Success', 'Test result submitted successfully');
      setProteinLevel('');
      setNotes('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit test result');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Test</Text>
      <Text style={styles.dateText} onPress={() => setShowDatePicker(true)}>
        {date.toDateString()}
      </Text>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Protein Level</Text>
      <Picker
        selectedValue={proteinLevel}
        onValueChange={(itemValue) => setProteinLevel(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select..." value="" />
        <Picker.Item label="Negative" value="Negative" />
        <Picker.Item label="Trace" value="Trace" />
        <Picker.Item label="+1" value="+1" />
        <Picker.Item label="+2" value="+2" />
        <Picker.Item label="+3" value="+3" />
      </Picker>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional notes..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button title="Submit Result" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  dateText: { marginBottom: 12, fontSize: 16 },
  picker: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlignVertical: 'top',
    height: 80,
  },
});

export default SubmitResultScreen;
