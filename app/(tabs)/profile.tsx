import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Camera, Check, X, Edit3 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const PRESET_AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=15',
];

export default function ProfileScreen() {
  const { profile, updateProfile } = useUser();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const startEdit = () => {
    setName(profile.name);
    setBio(profile.bio);
    setAvatar(profile.avatar);
    setShowPresets(false);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setShowPresets(false);
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    await updateProfile({ name: name.trim(), bio: bio.trim(), avatar });
    setSaving(false);
    setEditing(false);
    setShowPresets(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
      setShowPresets(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>PROFILE</Text>
        {!editing ? (
          <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
            <Edit3 color="#E6F358" size={16} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={cancel}>
              <X color="#9CA3AF" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Check color="#000" size={18} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: editing ? avatar : profile.avatar }} style={styles.avatar} />
          {editing && (
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => setShowPresets((v) => !v)}
            >
              <Camera color="#000" size={16} />
            </TouchableOpacity>
          )}
        </View>

        {editing && showPresets && (
          <View style={styles.presetRow}>
            {PRESET_AVATARS.map((uri) => (
              <TouchableOpacity key={uri} onPress={() => { setAvatar(uri); setShowPresets(false); }}>
                <Image
                  source={{ uri }}
                  style={[styles.presetAvatar, avatar === uri && styles.presetSelected]}
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Camera color="#9CA3AF" size={18} />
              <Text style={styles.uploadText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>NAME</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#555"
            maxLength={30}
            autoFocus
          />
        ) : (
          <Text style={styles.value}>{profile.name}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>BIO</Text>
        {editing ? (
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell the galaxy about yourself"
            placeholderTextColor="#555"
            maxLength={100}
            multiline
            numberOfLines={3}
          />
        ) : (
          <Text style={styles.value}>{profile.bio || '—'}</Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>3</Text>
          <Text style={styles.statLabel}>Planets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>12</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>7</Text>
          <Text style={styles.statLabel}>Explored</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(230,243,88,0.4)',
  },
  editBtnText: {
    color: '#E6F358',
    fontSize: 13,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F358',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(230,243,88,0.4)',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6F358',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    justifyContent: 'center',
  },
  presetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetSelected: {
    borderColor: '#E6F358',
  },
  uploadBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  uploadText: {
    color: '#9CA3AF',
    fontSize: 7,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,243,88,0.4)',
    paddingBottom: 8,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statNum: {
    color: '#E6F358',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
});