import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Plus, Search, Edit2, Trash2, User, Mail, Phone, Shield, CheckCircle, XCircle, Filter, RotateCcw, Users } from 'lucide-react-native';
import { useUsuariosAll } from '@/hooks/usuario/useUsuariosAll';

interface Usuario {
  id_rol: number;
  nombre_completo: string;
  nombre_rol: string;
  correo: string;
  telefono?: string;
  activo: boolean;
  creado_en: Date;
  total_pedidos: number;
}

const GestionUsuarioScreen = () => {
  const router = useRouter();

  const { data: usuarios = [], isLoading, error, refetch } = useUsuariosAll();

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState<'todos' | 'admin' | 'mesero' | 'cajero' | 'cocinero'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    nombre_rol: 'mesero',
    correo: '',
    telefono: '',
    clave: '',
    confirmarClave: ''
  });

  const usuariosFiltrados = useMemo(() => {
    if (!usuarios || usuarios.length === 0) return [];

    let resultados = [...usuarios];

    if (busqueda) {
      resultados = resultados.filter(usuario =>
        usuario.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroRol !== 'todos') {
      resultados = resultados.filter(usuario => usuario.nombre_rol === filtroRol);
    }

    if (filtroEstado !== 'todos') {
      resultados = resultados.filter(usuario =>
        filtroEstado === 'activo' ? usuario.activo : !usuario.activo
      );
    }

    return resultados;
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  // Manejar estados de carga y error
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <User size={28} color="#e63946" />
            <Text style={styles.headerText}>Gestión de Usuarios</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <User size={28} color="#e63946" />
            <Text style={styles.headerText}>Gestión de Usuarios</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar usuarios</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <RotateCcw size={20} color="#fff" />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const abrirModalNuevo = () => {
    setUsuarioEditando(null);
    setFormData({
      nombre_completo: '',
      nombre_rol: 'mesero',
      correo: '',
      telefono: '',
      clave: '',
      confirmarClave: ''
    });
    setModalVisible(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre_completo: usuario.nombre_completo,
      nombre_rol: usuario.nombre_rol,
      correo: usuario.correo,
      telefono: usuario.telefono || '',
      clave: '',
      confirmarClave: ''
    });
    setModalVisible(true);
  };

  const guardarUsuario = () => {
    if (!formData.nombre_completo || !formData.correo || !formData.nombre_rol) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    if (!usuarioEditando && (!formData.clave || !formData.confirmarClave)) {
      Alert.alert('Error', 'La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (formData.clave !== formData.confirmarClave) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // TODO: Implementar llamadas a la API para crear/actualizar usuarios
    // Por ahora solo cerramos el modal
    Alert.alert(
      'Funcionalidad en desarrollo',
      `Usuario ${usuarioEditando ? 'actualizado' : 'creado'} correctamente (simulación)`
    );

    setModalVisible(false);
  };

  const toggleEstadoUsuario = (id: number) => {
    // TODO: Implementar llamada a la API para cambiar estado
    Alert.alert(
      'Funcionalidad en desarrollo',
      'Estado del usuario cambiado (simulación)'
    );
  };

  const eliminarUsuario = (id: number) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Está seguro de que desea eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar llamada a la API para eliminar
            Alert.alert(
              'Funcionalidad en desarrollo',
              'Usuario eliminado (simulación)'
            );
          }
        }
      ]
    );
  };

  const getColorRol = (rol: string) => {
    switch (rol) {
      case 'admin': return '#dc2626';
      case 'mesero': return '#3b82f6';
      case 'cajero': return '#10b981';
      case 'cocinero': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getEstadisticas = () => {
    if (!usuarios) return { total: 0, activos: 0, admins: 0, meseros: 0 };

    return {
      total: usuarios.length,
      activos: usuarios.filter(u => u.activo).length,
      admins: usuarios.filter(u => u.nombre_rol === 'admin').length,
      meseros: usuarios.filter(u => u.nombre_rol === 'mesero').length,
    };
  };

  const stats = getEstadisticas();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <User size={28} color="#e63946" />
          <Text style={styles.headerText}>Gestión de Usuarios</Text>
        </View>
        <Text style={styles.subHeader}>Administra el personal del restaurante</Text>
      </View>

      <View style={styles.statsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#dbeafe' }]}>
              <Users size={20} color="#3b82f6" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#d1fae5' }]}>
              <CheckCircle size={20} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.activos}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#fee2e2' }]}>
              <Shield size={20} color="#dc2626" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#dbeafe' }]}>
              <User size={20} color="#3b82f6" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.meseros}</Text>
            <Text style={styles.statLabel}>Meseros</Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChangeText={setBusqueda}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalNuevo}>
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[styles.filtroBtn, filtroRol === 'todos' && styles.filtroBtnActiveTodos]}
            onPress={() => setFiltroRol('todos')}
          >
            <Text style={[styles.filtroText, filtroRol === 'todos' && styles.filtroTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          {['admin', 'mesero', 'cajero', 'cocinero'].map(rol => (
            <TouchableOpacity
              key={rol}
              style={[
                styles.filtroBtn,
                filtroRol === rol && styles.filtroBtnActive,
                filtroRol === rol && { backgroundColor: getColorRol(rol), borderColor: getColorRol(rol) }
              ]}
              onPress={() => setFiltroRol(rol as any)}
            >
              <Shield size={16} color={filtroRol === rol ? '#fff' : getColorRol(rol)} strokeWidth={2.5} />
              <Text style={[styles.filtroText, filtroRol === rol && styles.filtroTextActive]}>
                {rol.charAt(0).toUpperCase() + rol.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.filtroDivider} />

          <TouchableOpacity
            style={[styles.filtroBtn, filtroEstado === 'activo' && styles.filtroBtnActiveActivo]}
            onPress={() => setFiltroEstado(filtroEstado === 'activo' ? 'todos' : 'activo')}
          >
            <CheckCircle size={16} color={filtroEstado === 'activo' ? '#fff' : '#10b981'} strokeWidth={2.5} />
            <Text style={[styles.filtroText, filtroEstado === 'activo' && styles.filtroTextActive]}>
              Activos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filtroBtn, filtroEstado === 'inactivo' && styles.filtroBtnActiveInactivo]}
            onPress={() => setFiltroEstado(filtroEstado === 'inactivo' ? 'todos' : 'inactivo')}
          >
            <XCircle size={16} color={filtroEstado === 'inactivo' ? '#fff' : '#ef4444'} strokeWidth={2.5} />
            <Text style={[styles.filtroText, filtroEstado === 'inactivo' && styles.filtroTextActive]}>
              Inactivos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.usuariosContainer}>
        {usuariosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Users size={64} color="#d1d5db" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
            <Text style={styles.emptySubText}>
              {busqueda ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios que coincidan con los filtros'}
            </Text>
          </View>
        ) : (
          usuariosFiltrados.map(usuario => {
            const colorRol = getColorRol(usuario.nombre_rol);

            return (
              <View key={usuario.id_rol} style={styles.usuarioCard}>
                <View style={[styles.estadoIndicator, { backgroundColor: usuario.activo ? '#10b981' : '#ef4444' }]} />

                <View style={styles.cardContent}>
                  <View style={styles.usuarioHeader}>
                    <View style={styles.usuarioInfo}>
                      <View style={[styles.avatarContainer, { backgroundColor: colorRol }]}>
                        <Text style={styles.avatarText}>
                          {usuario.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.usuarioDetails}>
                        <Text style={styles.usuarioNombre}>{usuario.nombre_completo}</Text>
                        <View style={styles.usuarioMeta}>
                          <View style={[styles.rolBadge, { backgroundColor: colorRol }]}>
                            <Shield size={12} color="#fff" strokeWidth={2.5} />
                            <Text style={styles.rolText}>
                              {usuario.nombre_rol.toUpperCase()}
                            </Text>
                          </View>
                          <View style={[styles.estadoBadge, { backgroundColor: usuario.activo ? '#d1fae5' : '#fee2e2' }]}>
                            {usuario.activo ? (
                              <CheckCircle size={12} color="#10b981" strokeWidth={2.5} />
                            ) : (
                              <XCircle size={12} color="#ef4444" strokeWidth={2.5} />
                            )}
                            <Text style={[styles.estadoText, { color: usuario.activo ? '#065f46' : '#991b1b' }]}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.usuarioContacto}>
                    <View style={styles.contactoItem}>
                      <View style={styles.contactoIcon}>
                        <Mail size={14} color="#6b7280" strokeWidth={2} />
                      </View>
                      <Text style={styles.contactoText}>{usuario.correo}</Text>
                    </View>
                    {usuario.telefono && (
                      <View style={styles.contactoItem}>
                        <View style={styles.contactoIcon}>
                          <Phone size={14} color="#6b7280" strokeWidth={2} />
                        </View>
                        <Text style={styles.contactoText}>{usuario.telefono}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.usuarioFooter}>
                    <View style={styles.usuarioStats}>
                      <Text style={styles.statsText}>
                        Desde {new Date(usuario.creado_en).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                      </Text>
                      {usuario.total_pedidos > 0 && (
                        <>
                          <Text style={styles.statsDot}>•</Text>
                          <Text style={styles.statsHighlight}>{usuario.total_pedidos} pedidos</Text>
                        </>
                      )}
                    </View>

                    <View style={styles.usuarioActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnEdit]}
                        onPress={() => abrirModalEditar(usuario)}
                      >
                        <Edit2 size={16} color="#3b82f6" strokeWidth={2.5} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, usuario.activo ? styles.actionBtnDeactivate : styles.actionBtnActivate]}
                        onPress={() => toggleEstadoUsuario(usuario.id_rol)}
                      >
                        {usuario.activo ? (
                          <XCircle size={16} color="#f59e0b" strokeWidth={2.5} />
                        ) : (
                          <CheckCircle size={16} color="#10b981" strokeWidth={2.5} />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnDelete]}
                        onPress={() => eliminarUsuario(usuario.id_rol)}
                      >
                        <Trash2 size={16} color="#ef4444" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal permanece igual */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* ... contenido del modal igual ... */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#343a40',
  },
  subHeader: {
    fontSize: 14,
    color: '#6c757d',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  statsWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    minWidth: 100,
    gap: 8,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filtrosWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filtroBtnActiveTodos: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filtroBtnActive: {
    borderWidth: 2,
  },
  filtroBtnActiveActivo: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  filtroBtnActiveInactivo: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
  },
  filtroTextActive: {
    color: '#fff',
  },
  filtroDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  usuariosContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  usuarioCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  estadoIndicator: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  usuarioHeader: {
    marginBottom: 16,
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  usuarioDetails: {
    flex: 1,
    gap: 8,
  },
  usuarioNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  usuarioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  rolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rolText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  usuarioContacto: {
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  usuarioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usuarioStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
  },
  statsDot: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '700',
  },
  statsHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  usuarioActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnEdit: {
    backgroundColor: '#dbeafe',
  },
  actionBtnDeactivate: {
    backgroundColor: '#fef3c7',
  },
  actionBtnActivate: {
    backgroundColor: '#d1fae5',
  },
  actionBtnDelete: {
    backgroundColor: '#fee2e2',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    lineHeight: 20,
  },
  formContainer: {
    padding: 24,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  required: {
    color: '#dc2626',
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  textInputPlain: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    minWidth: '47%',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  roleOptionTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cancelBtnText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});


export default GestionUsuarioScreen;