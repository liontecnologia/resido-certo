import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBadge from './StatusBadge';

const CollectionCard = ({ collection, onPress }) => {
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data não disponível';
    }
  };

  // Obter texto para o tipo de resíduo
  const getWasteTypeText = (wasteType) => {
    switch(wasteType) {
      case 'biomass_ash':
        return 'Cinza de Caldeira';
      case 'rice_husk_ash':
        return 'Cinza de Casca de Arroz';
      case 'sugarcane_ash':
        return 'Cinza de Bagaço de Cana';
      case 'wood_ash':
        return 'Cinza de Madeira';
      case 'other':
        return 'Outro';
      default:
        return wasteType;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.requestNumber}>{collection.requestNumber}</Text>
        <StatusBadge status={collection.status} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{getWasteTypeText(collection.wasteType)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantidade:</Text>
          <Text style={styles.infoValue}>{collection.estimatedQuantity}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Solicitado em:</Text>
          <Text style={styles.infoValue}>{formatDate(collection.requestDate)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  requestNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardContent: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: 90,
    fontSize: 12,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  cardFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
  },
});

export default CollectionCard;