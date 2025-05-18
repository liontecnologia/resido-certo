import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const units = [
  { label: 'Quilogramas (kg)', value: 'kg' },
  { label: 'Toneladas (ton)', value: 'ton' },
  { label: 'Metros cúbicos (m³)', value: 'm3' }
];

const UnitSelectorModal = ({ visible, onClose, onSelectUnit, selectedUnit }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione a unidade</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={units}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.unitItem,
                  selectedUnit === item.value && styles.selectedUnitItem
                ]}
                onPress={() => {
                  onSelectUnit(item.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.unitLabel,
                  selectedUnit === item.value && styles.selectedUnitLabel
                ]}>
                  {item.label}
                </Text>
                
                {selectedUnit === item.value && (
                  <Ionicons name="checkmark" size={20} color="#22c55e" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  closeButton: {
    padding: 4
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  selectedUnitItem: {
    backgroundColor: '#dcfce7'
  },
  unitLabel: {
    fontSize: 16,
    color: '#111827'
  },
  selectedUnitLabel: {
    fontWeight: 'bold',
    color: '#22c55e'
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb'
  }
});

export default UnitSelectorModal;