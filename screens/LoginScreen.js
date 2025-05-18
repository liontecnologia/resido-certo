import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert,
  Image  // Adicionado import de Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '' || !selectedUserType) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione um tipo de usuário');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, selectedUserType);
      
      if (!success) {
        Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          {/* Substituído o Text por Image */}
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Transformando resíduos em recursos</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <View style={styles.userTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.userTypeButton, 
                selectedUserType === 'industry' && styles.selectedUserType
              ]}
              onPress={() => setSelectedUserType('industry')}
            >
              <Ionicons 
                name="business" 
                size={24} 
                color={selectedUserType === 'industry' ? '#ffffff' : '#6b7280'} 
              />
              <Text 
                style={[
                  styles.userTypeText,
                  selectedUserType === 'industry' && styles.selectedUserTypeText
                ]}
              >
                Agroindústria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.userTypeButton, 
                selectedUserType === 'public' && styles.selectedUserType
              ]}
              onPress={() => setSelectedUserType('public')}
            >
              <Ionicons 
                name="business" 
                size={24} 
                color={selectedUserType === 'public' ? '#ffffff' : '#6b7280'} 
              />
              <Text 
                style={[
                  styles.userTypeText,
                  selectedUserType === 'public' && styles.selectedUserTypeText
                ]}
              >
                Órgão Público
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Criar agora</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 CinzAgro. Todos os direitos reservados.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {  // Adicionado estilo para a logo
    width: 300,
    height: 125,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 3,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 6,
  },
  selectedUserType: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
  },
  selectedUserTypeText: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#22c55e',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#86efac',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#4b5563',
    fontSize: 14,
  },
  registerLink: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default LoginScreen;