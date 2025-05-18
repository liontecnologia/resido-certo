import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const FormInput = ({ label, children, required = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  requiredStar: {
    color: '#ef4444',
    marginLeft: 2,
  },
});

export default FormInput;