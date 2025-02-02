import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

function City() {
  // This id is coming from the URL. Where we click on a particular city, we get redirected to a City component here where we get the id from the URL that is a global state and we use that id to get the details about the city using the getCity method in CitiesContext which is passed using a context provider.
  const { id } = useParams();
  const { currentCity, getCity, isLoading } = useCities();
  const [cityLoading, setCityLoading] = useState(false);

  // This will set the currentCity state to the city we get from getCity(id)
  // The getCity(id) function lives in our CitiesContext file. If we include this in our depenedency array, then this will execute the useEffect() infinitely as getCity() function updates a state variable in our CitiesContext which will cause the <Provider> component to re-render and so a new getCity() function will be created which is not same as the previous one as functions are objects and {} !== {}. So we will have to memoize the getCity(id) function in the CitiesContext and then add it as a dependency to our useEffect()

  useEffect(
    function () {
      getCity(id);
      setCityLoading(true);
    },
    [id, getCity]
  );

  const { emoji, cityName, date, notes } = currentCity;

  if (isLoading || !cityLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{flagemojiToPNG(emoji)}</span> {cityName}
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

export default City;
