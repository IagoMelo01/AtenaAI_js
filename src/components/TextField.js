import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function TextField({ label, error, style, inputRef, ...inputProps }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={inputRef}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#7D8597"
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#14213D',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#14213D',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  error: {
    marginTop: 4,
    color: '#D32F2F',
    fontSize: 13,
  },
});
