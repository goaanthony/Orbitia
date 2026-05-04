import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/e3/aa/47/e3aa47f7914d1b77f0b00d99f2efea1f.jpg' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Foutre idée</Text>
      <Text style={styles.sub}>Space Explorer</Text>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  btn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
  },
});