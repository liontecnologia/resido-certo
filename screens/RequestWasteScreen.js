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
import DateTimePicker from '@react-native-community/datetimepicker';
import FormInput from '../components/FormInput';
import UnitSelectorModal from '../components/UnitSelectorModal';

const WasteTypeOptions = [
  { label: 'Cinza de Caldeira (Biomassa)', value: 'biomass_ash' },
  { label: 'Cinza de Casca de Arroz', value: 'rice_husk_ash' },
  { label: 'Cinza de Bagaço de Cana', value: 'sugarcane_ash' },
  { label: 'Cinza de Madeira', value: 'wood_ash' },
  { label: 'Mistura de Cinzas', value: 'mixed_ash' }
];

const PurposeOptions = [
  { label: 'Correção de Solo', value: 'soil_correction' },
  { label: 'Adubação Orgânica', value: 'organic_fertilization' },
  { label: 'Compostagem', value: 'composting' },
  { label: 'Viveiro Municipal', value: 'municipal_nursery' },
  { label: 'Hortas Comunitárias', value: 'community_gardens' },
  { label: 'Recuperação de Áreas Degradadas', value: 'land_recovery' },
  { label: 'Outro', value: 'other' }
];

const RequestWasteScreen = ({ navigation }) => {
  const [wasteType, setWasteType] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [purpose, setPurpose] = useState('');
  const [neededBy, setNeededBy] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Uma semana a partir de hoje
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para os modais
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [wasteTypeModalVisible, setWasteTypeModalVisible] = useState(false);
  const [purposeModalVisible, setPurposeModalVisible] = useState(false);

  // Função para gerar um ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Formatar data para exibição
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handler para mudança na data
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNeededBy(selectedDate);
    }
  };

  // Obter texto para o tipo de resíduo selecionado
  const getWasteTypeText = () => {
    if (!wasteType) return 'Selecione o tipo de resíduo';
    const selectedType = WasteTypeOptions.find(option => option.value === wasteType);
    return selectedType ? selectedType.label : 'Selecione o tipo de resíduo';
  };

  // Obter texto para a finalidade selecionada
  const getPurposeText = () => {
    if (!purpose) return 'Selecione a finalidade';
    const selectedPurpose = PurposeOptions.find(option => option.value === purpose);
    return selectedPurpose ? selectedPurpose.label : 'Selecione a finalidade';
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

  // Salvar nova solicitação de resíduos
  const handleSaveRequest = async () => {
    if (!wasteType || !requestedQuantity || !purpose) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o tipo de resíduo, a quantidade desejada e a finalidade.');
      return;
    }

    setIsLoading(true);

    try {
      // Obter as solicitações existentes
      const storedRequests = await AsyncStorage.getItem('wasteRequests');
      let requests = storedRequests ? JSON.parse(storedRequests) : [];

      // Criar nova solicitação
      const newRequest = {
        id: generateId(),
        wasteType,
        requestedQuantity: `${requestedQuantity} ${quantityUnit}`,
        purpose,
        neededBy: neededBy.toISOString(),
        notes,
        status: 'pending',
        requestDate: new Date().toISOString(),
        // Em uma aplicação real, esses dados viriam de APIs e usuário logado
        requestNumber: `REQ-${Math.floor(Math.random() * 1000) + 1000}`,
        organizationName: 'Secretaria Municipal de Agricultura',
        location: 'Av. Principal, 123 - Tangará da Serra, MT',
      };

      // Adicionar nova solicitação ao array
      requests.push(newRequest);

      // Salvar de volta no AsyncStorage
      await AsyncStorage.setItem('wasteRequests', JSON.stringify(requests));

      // Alerta de sucesso
      Alert.alert(
        'Solicitação Enviada',
        'Sua solicitação foi registrada com sucesso. Você receberá uma confirmação em breve.',
        [{ 
          text: 'OK', 
          onPress: () => navigation.goBack() // Simplesmente volta à tela anterior
        }]
      );
    } catch (error) {
      console.log('Erro ao salvar solicitação:', error);
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
            <Text style={styles.sectionTitle}>Solicitar Resíduos</Text>
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
                label="Quantidade Desejada"
                required
              >
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 500"
                  keyboardType="numeric"
                  value={requestedQuantity}
                  onChangeText={setRequestedQuantity}
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
            label="Finalidade/Uso"
            required
          >
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setPurposeModalVisible(true)}
            >
              <Text style={[
                styles.selectorText, 
                !purpose && styles.placeholderText
              ]}>
                {getPurposeText()}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </FormInput>

          <FormInput
            label="Data de Necessidade"
            required
          >
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(neededBy)}</Text>
              <Ionicons name="calendar" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={neededBy}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </FormInput>

          <FormInput
            label="Observações"
            required={false}
          >
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações adicionais sobre a solicitação (opcional)"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </FormInput>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <Text style={styles.infoText}>
              Após enviar sua solicitação, nossa equipe verificará a disponibilidade dos resíduos solicitados e entrará em contato para confirmar.
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
            onPress={handleSaveRequest}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
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
      
      {/* Modal para seleção de tipo de resíduo */}
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
      
      {/* Modal para seleção de finalidade */}
      <Modal
        visible={purposeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPurposeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a finalidade</Text>
              <TouchableOpacity 
                onPress={() => setPurposeModalVisible(false)} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {PurposeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    purpose === option.value && styles.selectedOptionItem
                  ]}
                  onPress={() => {
                    setPurpose(option.value);
                    setPurposeModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionLabel,
                    purpose === option.value && styles.selectedOptionLabel
                  ]}>
                    {option.label}
                  </Text>
                  
                  {purpose === option.value && (
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
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

export default RequestWasteScreen;