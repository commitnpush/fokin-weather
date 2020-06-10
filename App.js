import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Loading, Weather } from "./components";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "23daf14c8f654062b58941a7e958dcf1";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const { temp, icon, condition } = weather || {};
  const getWeather = async (lat, lon) => {
    const {
      data: {
        main: { temp },
        weather: [{ icon, main: condition }],
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    setWeather({
      temp,
      icon,
      condition,
    });
  };

  const getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude: lat, longitude: long },
      } = await Location.getCurrentPositionAsync();
      return { lat, long };
    } catch (error) {
      Alert.alert("Can't find you", "So sad");
    }
  };

  useEffect(() => {
    async function fetchApi() {
      const { lat, long } = await getLocation();
      await getWeather(lat, long);
      setIsLoading(false);
    }
    fetchApi();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <Weather temp={temp} condition={condition} icon={icon} />
  );
}
