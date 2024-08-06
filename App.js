import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import * as Location from 'expo-location';
import { WEATHER_API_KEY } from '@env';
import Fontisto from '@expo/vector-icons/Fontisto';

const SCREEN_WIDTH = Dimensions.get('window').width;

const icons = {
  Clear: 'day-sunny',
  Clouds: 'cloudy',
  Rain: 'rain',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Drizzle: 'day-rain',
  Thunderstorm: 'lightning',
};

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
    const { list } = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
      )
    ).json();

    const filteredList = list.filter(({ dt_txt }) =>
      dt_txt.endsWith('00:00:00')
    );

    setDays(filteredList);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {ok && (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            /* 수평 모드 */
            horizontal
            /* 페이지 쫀득하게 넘기기 */
            pagingEnabled
            /* 바닥 ScrollIndicator */
            showsHorizontalScrollIndicator="false"
            /* 바닥 ScrollIndicator Color 지정 Ios만 동작*/
            // indicatorStyle="white"
          >
            {days.length === 0 ? (
              <View style={styles.day}>
                <ActivityIndicator color="white" size="large" />
              </View>
            ) : (
              days.map((day, index) => (
                <View key={index} style={styles.day}>
                  <Text style={styles.temp}>
                    {parseFloat(day.main.temp).toFixed(1)}
                  </Text>
                  <View style={styles.weather}>
                    <Fontisto
                      name={icons[day.weather[0].main]}
                      size={50}
                      color="black"
                    />
                    <Text style={styles.description}>
                      {day.weather[0].main}
                    </Text>
                  </View>
                  <Text style={styles.date}>{day.dt_txt.split(' ')[0]}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
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
    fontSize: 70,
    fontWeight: 500,
    color: '#fff',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 150,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  description: { fontSize: 60 },
  date: {
    marginTop: 5,
    fontSize: 30,
  },
});
