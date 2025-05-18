import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const StatusBadge = ({ status }) => {
  let backgroundColor, textColor, label;

  switch(status) {
    case 'pending':
      backgroundColor = '#fef3c7';
      textColor = '#d97706';
      label = 'Pendente';
      break;
    case 'scheduled':
      backgroundColor = '#dbeafe';
      textColor = '#2563eb';
      label = 'Agendada';
      break;
    case 'completed':
      backgroundColor = '#dcfce7';
      textColor = '#16a34a';
      label = 'Concluída';
      break;
    case 'canceled':
      backgroundColor = '#fee2e2';
      textColor = '#dc2626';
      label = 'Cancelada';
      break;
    default:
      backgroundColor = '#f3f4f6';
      textColor = '#6b7280';
      label = status;
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StatusBadge;