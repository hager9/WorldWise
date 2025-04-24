import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };

    case "city/set":
      return { ...state, currentCity: action.payload };

    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesContextProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const { data } = await axios.get(
          `https://api.jsonbin.io/v3/b/680003a38561e97a50011257`,
          {
            headers: {
              "X-Master-Key":
                "$2a$10$OE1GnX2gi6aOz0SPRMqe0Oahizgb5Qg9aANrlETaPRNqbON5KoeWm",
            },
          }
        );
        dispatch({ type: "cities/loaded", payload: data.record.cities || [] });
      } catch (err) {
        console.error("Failed to fetch cities", err);
        dispatch({ type: "cities/loaded", payload: [] }); // fallback
      }
    }

    fetchCities();
  }, []);

  function getCityById(id) {
    const city = cities.find((city) => city.id === Number(id));
    dispatch({ type: "city/set", payload: city });
  }

  async function createCity(newCity) {
    const updatedCities = [...cities, newCity];
    dispatch({ type: "city/added", payload: newCity });

    try {
      await fetch("https://api.jsonbin.io/v3/b/680003a38561e97a50011257", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key":
            "$2a$10$OE1GnX2gi6aOz0SPRMqe0Oahizgb5Qg9aANrlETaPRNqbON5KoeWm",
        },
        body: JSON.stringify({ cities: updatedCities }),
      });
    } catch (err) {
      console.error("Error adding city to JSONBin:", err);
    }
  }

  async function deleteCity(id) {
    const updatedCities = cities.filter((city) => city.id !== id);
    dispatch({ type: "city/deleted", payload: id });

    try {
      await fetch("https://api.jsonbin.io/v3/b/680003a38561e97a50011257", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key":
            "$2a$10$OE1GnX2gi6aOz0SPRMqe0Oahizgb5Qg9aANrlETaPRNqbON5KoeWm",
        },
        body: JSON.stringify({ cities: updatedCities }),
      });
    } catch (err) {
      alert("There was an error deleting the city...");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCityById,
        currentCity,
        flagEmojiToPNG,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const flagEmojiToPNG = (flag) => {
  let countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

export { CitiesContextProvider, CitiesContext };
