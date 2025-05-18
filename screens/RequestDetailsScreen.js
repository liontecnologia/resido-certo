import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBadge from '../components/StatusBadge';

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params;

  // Formatar data para exibição
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString || 'Data não disponível';
    }
  };

  // Texto para finalidade
  const getPurposeText = (purpose) => {
    switch(purpose) {
      case 'soil_correction':
        return 'Correção de Solo';
      case 'organic_fertilization':
        return 'Adubação Orgânica';
      case 'composting':
        return 'Compostagem';
      case 'municipal_nursery':
        return 'Viveiro Municipal';
      case 'community_gardens':
        return 'Hortas Comunitárias';
      case 'land_recovery':
        return 'Recuperação de Áreas Degradadas';
      case 'other':
        return 'Outro';
      default:
        return purpose || 'Não especificado';
    }
  };

  // Função para cancelar solicitação
  const handleCancelRequest = () => {
    Alert.alert(
      'Cancelar Solicitação',
      'Tem certeza que deseja cancelar esta solicitação de resíduos?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          style: 'destructive',
          onPress: () => {
            // Aqui seria implementada a lógica para cancelar a solicitação
            // Neste MVP simples, apenas voltamos para a tela anterior
            Alert.alert('Solicitação Cancelada', 'Sua solicitação foi cancelada com sucesso.');
            navigation.goBack();
          } 
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.requestNumber}>{request.requestNumber}</Text>
        <StatusBadge status={request.status} />
      </View>

      {/* Informações da Solicitação */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Informações da Solicitação</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de Resíduo:</Text>
          <Text style={styles.infoValue}>
            {request.wasteType === 'biomass_ash' ? 'Cinza de Caldeira (Biomassa)' : 
             request.wasteType === 'rice_husk_ash' ? 'Cinza de Casca de Arroz' :
             request.wasteType === 'sugarcane_ash' ? 'Cinza de Bagaço de Cana' :
             request.wasteType === 'wood_ash' ? 'Cinza de Madeira' :
             request.wasteType === 'mixed_ash' ? 'Mistura de Cinzas' :
             request.wasteType === 'other' ? 'Outro' : request.wasteType}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantidade:</Text>
          <Text style={styles.infoValue}>{request.requestedQuantity}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Finalidade:</Text>
          <Text style={styles.infoValue}>{getPurposeText(request.purpose)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data da Solicitação:</Text>
          <Text style={styles.infoValue}>{formatDate(request.requestDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Necessário até:</Text>
          <Text style={styles.infoValue}>{formatDate(request.neededBy)}</Text>
        </View>

        {request.approvedDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Aprovação:</Text>
            <Text style={styles.infoValue}>{formatDate(request.approvedDate)}</Text>
          </View>
        )}
        
        {request.deliveryDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Entrega:</Text>
            <Text style={styles.infoValue}>{formatDate(request.deliveryDate)}</Text>
          </View>
        )}

        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Observações:</Text>
          <Text style={styles.notesText}>
            {request.notes || 'Nenhuma observação fornecida.'}
          </Text>
        </View>
      </View>

      {/* Endereço */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Local de Entrega</Text>
        </View>

        <Text style={styles.addressTitle}>{request.organizationName}</Text>
        <Text style={styles.addressText}>{request.location}</Text>
      </View>

      {/* Status da Solicitação */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Status da Solicitação</Text>
        </View>

        <View style={styles.timelineContainer}>
          <View style={[
            styles.timelineItem, 
            request.status === 'pending' || request.status === 'approved' || request.status === 'delivered' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="create" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Solicitação Registrada</Text>
              <Text style={styles.timelineDate}>{formatDate(request.requestDate)}</Text>
            </View>
          </View>

          <View style={[
            styles.timelineLine, 
            request.status === 'approved' || request.status === 'delivered' 
              ? styles.timelineLineActive 
              : styles.timelineLineInactive
          ]} />

          <View style={[
            styles.timelineItem, 
            request.status === 'approved' || request.status === 'delivered' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Solicitação Aprovada</Text>
              <Text style={styles.timelineDate}>
                {request.approvedDate 
                  ? formatDate(request.approvedDate) 
                  : 'Aguardando aprovação'}
              </Text>
            </View>
          </View>

          <View style={[
            styles.timelineLine, 
            request.status === 'delivered' 
              ? styles.timelineLineActive 
              : styles.timelineLineInactive
          ]} />

          <View style={[
            styles.timelineItem, 
            request.status === 'delivered' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="checkmark-done" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Resíduos Entregues</Text>
              <Text style={styles.timelineDate}>
                {request.deliveryDate 
                  ? formatDate(request.deliveryDate) 
                  : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      {request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelRequest}
          >
            <Ionicons name="close-circle" size={16} color="#ef4444" />
            <Text style={styles.cancelButtonText}>Cancelar Solicitação</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Alert.alert('Suporte', 'Entre em contato com nossa equipe pelo telefone (65) 99999-9999 ou pelo email suporte@cinzagro.com.br')}
        >
          <Ionicons name="call" size={16} color="#22c55e" />
          <Text style={styles.contactButtonText}>Contatar Suporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  requestNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
  },
  timelineContainer: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineItemActive: {
    opacity: 1,
  },
  timelineItemInactive: {
    opacity: 0.5,
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginLeft: 15,
  },
  timelineLineActive: {
    backgroundColor: '#22c55e',
  },
  timelineLineInactive: {
    backgroundColor: '#d1d5db',
  },
  actionButtons: {
    margin: 16,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
  },
  contactButtonText: {
    color: '#22c55e',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default RequestDetailsScreen;