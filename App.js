import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>Seoul</Text>
      </View>
      <View style={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3182f6',
  },
  city: {
    flex: 1.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 60,
    fontWeight: 500,
    color: '#fff',
  },
  weather: {
    flex: 3,
  },
  day: {
    flex: 1,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 150,
  },
  description: { marginTop: -10, fontSize: 60 },
});
