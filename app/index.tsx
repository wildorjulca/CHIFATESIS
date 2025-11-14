import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth/auth-store';

export default function Index() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // espera a que el estado se defina

    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(tabs)/home');
      } else {
        // router.replace('/login');
        router.replace('/login');

      }
    }, 500); // breve delay para permitir que el layout monte

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e63946" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
