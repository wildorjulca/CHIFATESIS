import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'cajero' | 'cliente'>('cliente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 
  const authMutation = useAuthMutation()

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isSignUp && !name) {
      setError('Por favor ingrese su nombre');
      return;
    }

    setError('');
    setLoading(true);

    try {

      const user = {
        correo: email,
        clave: password
      }
      authMutation.mutate(user)
      // if (isSignUp) {
      //   await signUp(email, password, name, role);
      //   Alert.alert('Éxito', 'Cuenta creada correctamente');
      // } else {
      //   await signIn(email, password);
      // }
      // router.replace('/(tabs)/home');


    } catch (err: any) {
      setError(err.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'cajero', label: 'Cajero' },
    { value: 'admin', label: 'Administrador' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ChifaPedidos</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {authMutation.error ? <Text style={styles.errorText}>{authMutation.error.message}</Text> : null}



        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isSignUp && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Rol:</Text>
            <View style={styles.roleButtons}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.roleButton,
                    role === r.value && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole(r.value as any)}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === r.value && styles.roleButtonTextActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (loading || authMutation.isPending) && styles.buttonDisabled,
          ]}
          onPress={handleAuth}
          disabled={authMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {authMutation.isPending ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Ingresar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e63946',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#e63946',
    borderColor: '#e63946',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#e63946',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    alignItems: 'center',
    padding: 8,
  },
  switchButtonText: {
    color: '#e63946',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#e63946',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
  },
});
