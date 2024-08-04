import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

import * as Location from 'expo-location';
import { WEATHER_API_KEY } from '@env';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const [city, setCity] = useState('...Loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    /* 5 가능한 가장 높은 수준의 정확도. getCurrentPositionAsync() 위도 경도 구해오는 메서드 */
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    /* reverseGeocodeAsync() 위도, 경도를 통해 현재 위치 정보를 가져오는 메서드 */
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);
    /* 날씨 API를 통한 Data 가져오기 */
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
    );
    const json = await response.json();
    console.log(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        /* 수평 모드 */
        horizontal
        /* 페이지 쫀득하게 넘기기 */
        pagingEnabled
        /* 바닥 ScrollIndicator */
        showsHorizontalScrollIndicator="false"
        /* 바닥 ScrollIndicator Color 지정 Ios만 동작*/
        // indicatorStyle="white"
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3182f6',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 60,
    fontWeight: 500,
    color: '#fff',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 150,
  },
  description: { marginTop: -10, fontSize: 60 },
});
