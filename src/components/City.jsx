import { useContext, useEffect } from "react";
import { CitiesContext } from "../contexts/CitiesContext";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import styles from "./City.module.css";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function City() {
  const { id } = useParams();
  const { getCityById, currentCity, isLoading, flagEmojiToPNG } =
    useContext(CitiesContext);

  useEffect(() => {
    getCityById(id);
  }, [getCityById, id]);

  if (!currentCity) return <Spinner />;

  if (isLoading) return <Spinner />;
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{flagEmojiToPNG(emoji)}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}
