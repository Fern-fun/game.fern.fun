import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function RANDM() {
  const [data, setData] = React.useState({});

  const [hotStreak, setHotStreak] = React.useState(
    parseInt(localStorage.getItem("hotStreakRandM"))
      ? parseInt(localStorage.getItem("hotStreakRandM"))
      : 0
  );

  const [maxHotStreak, setMaxHotStreak] = React.useState(
    parseInt(localStorage.getItem("maxHotStreakRandM"))
      ? parseInt(localStorage.getItem("maxHotStreakRandM"))
      : 0
  );

  const [error, setError] = React.useState("");

  const checkAnwser = (e) => {
    if (e.target.id === data.correct) {
      setHotStreak((e) => e + 1);
      localStorage.setItem("hotStreakRandM", parseInt(hotStreak + 1));
      if (hotStreak + 1 > maxHotStreak) {
        setMaxHotStreak(hotStreak + 1);
        localStorage.setItem("maxHotStreakRandM", parseInt(hotStreak + 1));
      }
      randomData();
    } else {
      setHotStreak(0);
      localStorage.setItem("hotStreakRandM", parseInt(0));
      randomData();
    }
  };

  const randomData = () => {
    fetch("https://api.fern.fun/r&m/random")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        localStorage.setItem("randMGame", JSON.stringify(data));
        setError("");
      })
      .catch(setError("Error"));
  };

  React.useEffect(() => {
    if (localStorage.getItem("randMGame")) {
      setData(JSON.parse(localStorage.getItem("randMGame")));
    } else {
      randomData();
    }
  }, []);

  return (
    <>
      <div className="guessPanel">
        {error === "" ? (
          <>
            <div id="hotStreak">
              <LazyLoadImage src="/img/fire.svg" alt="hotStreak" />
              {hotStreak} {maxHotStreak ? `(${maxHotStreak})` : ""}
            </div>
            <div id="img">
              {"character" in data ? (
                <LazyLoadImage src={data.character.image} alt={data.correct} />
              ) : (
                <img alt="no-img" />
              )}
            </div>
            <div id="anwsers">
              {"options" in data
                ? data.options.map((name) => (
                    <button id={name} key={name} onClick={checkAnwser}>
                      {name}
                    </button>
                  ))
                : ""}
            </div>
            <div id="count">
              {"count" in data ? "In db: " + data.count : ""}
            </div>
          </>
        ) : (
          <div className="loading">
            <img src="/img/loading.svg" />
          </div>
        )}
      </div>
    </>
  );
}

export default RANDM;
