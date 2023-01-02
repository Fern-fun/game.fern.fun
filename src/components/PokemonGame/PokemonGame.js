import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function PokemonGame() {
  const [data, setData] = React.useState({});

  const [hotStreak, setHotStreak] = React.useState(
    parseInt(localStorage.getItem("hotStreakPokemon"))
      ? parseInt(localStorage.getItem("hotStreakPokemon"))
      : 0
  );

  const [error, setError] = React.useState("");

  const checkAnwser = (e) => {
    if (e.target.id === data.pokemon.name) {
      setHotStreak((e) => e + 1);
      localStorage.setItem("hotStreakPokemon", parseInt(hotStreak + 1));
      randomData();
    } else {
      setHotStreak(0);
      localStorage.setItem("hotStreakPokemon", parseInt(0));
      randomData();
    }
  };

  const randomData = () => {
    fetch("https://api.fern.fun/pokemon/random")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError("");
      })
      .catch(setError("Error"));
  };

  React.useEffect(() => {
    randomData();
  }, []);

  return (
    <>
      <div className="guessPanel">
        {error === "" ? (
          <>
            <div id="hotStreak">
              <LazyLoadImage src="/img/fire.svg" alt="hotStreak" />
              {hotStreak}
            </div>
            <div id="flags">
              {"pokemon" in data ? (
                <LazyLoadImage
                  src={data.img}
                  alt={data.pokemon.name}
                  style={{ width: "215px" }}
                />
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

export default PokemonGame;
