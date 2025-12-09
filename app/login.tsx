import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthMutation } from '@/hooks/auth/useAuthMutation';

type AuthMode = 'login' | 'signup';
type UserRole = 'admin' | 'cajero' | 'cliente';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('cliente');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const authMutation = useAuthMutation();

  // Efecto para manejar éxito/error de la mutación
  useEffect(() => {
    if (authMutation.isSuccess) {
      // Limpiar formulario
      resetForm();
      
      // Redirigir
      router.replace('/(tabs)/home');
    }
    
    if (authMutation.error) {
      setError(authMutation.error.message || 'Error de autenticación');
      setIsSubmitting(false);
    }
  }, [authMutation.isSuccess, authMutation.error]);

  const validateForm = (): boolean => {
    setError('');

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }

    // Validar contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Por favor ingrese su nombre');
        return false;
      }
      
      // Validar contraseña más fuerte para registro
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres para registro');
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('cliente');
    setError('');
    setIsSubmitting(false);
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const userData = {
        correo: email,
        clave: password,
        ...(mode === 'signup' && {
          nombre: name,
          rol: role,
          // Agregar otros campos necesarios para registro
        }),
      };

      authMutation.mutate(userData);
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const roles = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'cajero', label: 'Cajero' },
    { value: 'admin', label: 'Administrador' },
  ] as const;

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>ChifaPedidos</Text>
        <Text style={styles.subtitle}>
          {mode === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {mode === 'signup' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isSubmitting}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isSubmitting}
        />

        {mode === 'signup' && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Rol:</Text>
            <View style={styles.roleButtons}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.roleButton,
                    role === r.value && styles.roleButtonActive,
                    isSubmitting && styles.disabled,
                  ]}
                  onPress={() => !isSubmitting && setRole(r.value)}
                  disabled={isSubmitting}
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
            (isSubmitting || authMutation.isPending) && styles.buttonDisabled,
          ]}
          onPress={handleAuth}
          disabled={isSubmitting || authMutation.isPending}
        >
          {isSubmitting || authMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'signup' ? 'Registrarse' : 'Ingresar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, isSubmitting && styles.disabled]}
          onPress={switchMode}
          disabled={isSubmitting}
        >
          <Text style={styles.switchButtonText}>
            {mode === 'signup'
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>

        {/* Opcional: Botón de olvidé contraseña */}
        {mode === 'login' && (
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        )}
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
    minHeight: 52,
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  switchButtonText: {
    color: '#e63946',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#e63946',
    fontSize: 14,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    padding: 8,
  },
  forgotPasswordText: {
    color: '#6c757d',
    fontSize: 14,
  },
});