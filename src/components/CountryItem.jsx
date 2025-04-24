import { useContext } from "react";
import styles from "./CountryItem.module.css";
import { CitiesContext } from "../contexts/CitiesContext";

function CountryItem({ country }) {
  const { flagEmojiToPNG } = useContext(CitiesContext);
  return (
    <li className={styles.countryItem}>
      <span>{flagEmojiToPNG(country.emoji)}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
