import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import UnitSelectorModal from '../components/UnitSelectorModal';

const WasteTypeOptions = [
  { label: 'Cinza de Caldeira (Biomassa)', value: 'biomass_ash' },
  { label: 'Cinza de Casca de Arroz', value: 'rice_husk_ash' },
  { label: 'Cinza de Bagaço de Cana', value: 'sugarcane_ash' },
  { label: 'Cinza de Madeira', value: 'wood_ash' },
  { label: 'Outro', value: 'other' }
];

const NewCollectionScreen = ({ navigation }) => {
  const [wasteType, setWasteType] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para os modais
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [wasteTypeModalVisible, setWasteTypeModalVisible] = useState(false);

  // Função para gerar um ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Obter texto para o tipo de resíduo selecionado
  const getWasteTypeText = () => {
    if (!wasteType) return 'Selecione o tipo de resíduo';
    const selectedType = WasteTypeOptions.find(option => option.value === wasteType);
    return selectedType ? selectedType.label : 'Selecione o tipo de resíduo';
  };

  // Obter texto para a unidade selecionada
  const getUnitText = () => {
    switch (quantityUnit) {
      case 'kg': return 'Quilogramas (kg)';
      case 'ton': return 'Toneladas (ton)';
      case 'm3': return 'Metros cúbicos (m³)';
      default: return 'Selecione a unidade';
    }
  };

  // Salvar nova solicitação de coleta
  const handleSaveCollection = async () => {
    if (!wasteType || !estimatedQuantity) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o tipo de resíduo e a quantidade estimada.');
      return;
    }

    setIsLoading(true);

    try {
      // Obter as coletas existentes
      const storedCollections = await AsyncStorage.getItem('collections');
      let collections = storedCollections ? JSON.parse(storedCollections) : [];

      // Criar nova coleta
      const newCollection = {
        id: generateId(),
        wasteType,
        estimatedQuantity: `${estimatedQuantity} ${quantityUnit}`,
        notes,
        status: 'pending',
        requestDate: new Date().toISOString(),
        // Em uma aplicação real, esses dados viriam de APIs e usuário logado
        requestNumber: `SOL-${Math.floor(Math.random() * 1000) + 1000}`,
        companyName: 'Agroindústria Exemplo',
        location: 'Av. Principal, 123 - Tangará da Serra, MT',
      };

      // Adicionar nova coleta ao array
      collections.push(newCollection);

      // Salvar de volta no AsyncStorage
      await AsyncStorage.setItem('collections', JSON.stringify(collections));

      // Alerta de sucesso
      Alert.alert(
        'Solicitação Enviada',
        'Sua solicitação de coleta foi registrada com sucesso. Você receberá uma confirmação em breve.',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
      );
    } catch (error) {
      console.log('Erro ao salvar coleta:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={20} color="#22c55e" />
            <Text style={styles.sectionTitle}>Informações da Coleta</Text>
          </View>

          <FormInput
            label="Tipo de Resíduo de Cinza"
            required
          >
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setWasteTypeModalVisible(true)}
            >
              <Text style={[
                styles.selectorText, 
                !wasteType && styles.placeholderText
              ]}>
                {getWasteTypeText()}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </FormInput>

          <View style={styles.row}>
            <View style={styles.quantityContainer}>
              <FormInput
                label="Quantidade Estimada"
                required
              >
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 500"
                  keyboardType="numeric"
                  value={estimatedQuantity}
                  onChangeText={setEstimatedQuantity}
                />
              </FormInput>
            </View>
            
            <View style={styles.unitContainer}>
              <FormInput
                label="Unidade"
                required={false}
              >
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => setUnitModalVisible(true)}
                >
                  <Text style={styles.selectorText}>{getUnitText()}</Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              </FormInput>
            </View>
          </View>

          <FormInput
            label="Observações"
            required={false}
          >
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações adicionais sobre o resíduo (opcional)"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </FormInput>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <Text style={styles.infoText}>
              Após enviar sua solicitação, nossa equipe entrará em contato para agendar a coleta conforme disponibilidade.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSaveCollection}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Enviando...' : 'Solicitar Coleta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Modal para seleção de unidade */}
      <UnitSelectorModal
        visible={unitModalVisible}
        onClose={() => setUnitModalVisible(false)}
        onSelectUnit={setQuantityUnit}
        selectedUnit={quantityUnit}
      />
      
      {/* Modal para seleção de tipo de resíduo (usando componente customizado) */}
      <Modal
        visible={wasteTypeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setWasteTypeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o tipo de resíduo</Text>
              <TouchableOpacity 
                onPress={() => setWasteTypeModalVisible(false)} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {WasteTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    wasteType === option.value && styles.selectedOptionItem
                  ]}
                  onPress={() => {
                    setWasteType(option.value);
                    setWasteTypeModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionLabel,
                    wasteType === option.value && styles.selectedOptionLabel
                  ]}>
                    {option.label}
                  </Text>
                  
                  {wasteType === option.value && (
                    <Ionicons name="checkmark" size={20} color="#22c55e" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    padding: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  quantityContainer: {
    flex: 1,
    marginRight: 8,
  },
  unitContainer: {
    flex: 1,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  selectorText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1e40af',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#86efac',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos do modal
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  selectedOptionItem: {
    backgroundColor: '#dcfce7'
  },
  optionLabel: {
    fontSize: 16,
    color: '#111827'
  },
  selectedOptionLabel: {
    fontWeight: 'bold',
    color: '#22c55e'
  }
});

export default NewCollectionScreen;