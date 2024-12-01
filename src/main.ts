import "./style.css";
import { IPokeAPI, IPokemon, IPokemonPokemon, IPokemonType } from "./interface/IPokeAPI";

// Auswahl der HTML-Elemente
const inputText = document.querySelector("#inputText") as HTMLInputElement;
const buttons = document.querySelectorAll("button") as NodeListOf<HTMLButtonElement>;
const cardsWrapper = document.querySelector("#cardsWrapper") as HTMLDivElement;

// Basis-URL für API-Aufrufe:
// Definiert die Basis-URL für die PokéAPI, um API-Endpunkte einfach zu erstellen, ohne die Basis-URL jedes Mal neu schreiben zu müssen.
const BASE_URL = "https://pokeapi.co/api/v2/";

// Funktion zum Abrufen von Pokémon nach Button-Wert:
// Diese Funktion lädt Pokémon-Daten basierend auf dem Wert eines gedrückten Buttons, um spezifische Pokémon-Daten zu laden und anzuzeigen, basierend auf der Auswahl des Benutzers
const fetchPokemons = async (buttonValue: string) => {
    cardsWrapper.innerHTML = "";
    let pokemonURL = `${BASE_URL}${buttonValue}`;

    try {
        const response = await fetch(pokemonURL);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data: IPokemonType = await response.json();
        const pokemonArr: IPokemonPokemon[] = data.pokemon;

        pokemonArr.forEach((singlePokemon: IPokemonPokemon) => {
            renderCards(singlePokemon.pokemon, true);
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Pokémon: ", error);
        cardsWrapper.innerHTML = "<p>Fehler beim Abrufen der Pokémon. Bitte versuche es später erneut.</p>";
    }
};

// Funktion zum Abrufen der Standard-Pokémon:
// Diese Funktion lädt eine Standardliste von Pokémon-Daten, um eine Basisanzeige von Pokémon zu haben, wenn die Seite geladen wird
const fetchDefaultPokemons = async () => {
    const allPokemonURL = `${BASE_URL}pokemon?limit=50&offset=0`;

    try {
        const response = await fetch(allPokemonURL);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data: IPokeAPI = await response.json();
        const pokemonArr: IPokemon[] = data.results;

        pokemonArr.forEach((singlePokemon: IPokemon) => {
            renderCards(singlePokemon, true);
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Standard-Pokémon: ", error);
        cardsWrapper.innerHTML = "<p>Fehler beim Abrufen der Standard-Pokémon. Bitte versuche es später erneut.</p>";
    }
};
fetchDefaultPokemons();

// Funktion zum Filtern und Abrufen von Pokémon basierend auf Text-Eingabe:
// Diese Funktion filtert Pokémon basierend auf der Benutzereingabe und lädt die entsprechenden Daten, um dem Benutzer zu ermöglichen, nach spezifischen Pokémon zu suchen.
const fetchPokemonArr = async (textValue: string) => {
    cardsWrapper.innerHTML = "";
    const allPokemonURL = `${BASE_URL}pokemon?limit=1000&offset=0`;

    try {
        const response = await fetch(allPokemonURL);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data: IPokeAPI = await response.json();
        const allPokemonArr: IPokemon[] = data.results;

        const filteredPokemonArr: IPokemon[] = allPokemonArr.filter((singlePokemon: IPokemon) => {
            return singlePokemon.name.includes(textValue);
        });

        if (filteredPokemonArr.length > 1) {
            filteredPokemonArr.forEach((pokemon: IPokemon) => {
                renderCards(pokemon, true);
            });
        } else if (filteredPokemonArr.length === 1) {
            renderCards(filteredPokemonArr[0], false);
        } else {
            cardsWrapper.innerHTML = "<p>Kein Pokémon gefunden.</p>";
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Pokémon basierend auf Text-Eingabe: ", error);
        cardsWrapper.innerHTML = "<p>Fehler beim Abrufen der Pokémon. Bitte versuche es später erneut.</p>";
    }
};

// Event-Listener für Buttons:
// Fügt Event-Listener zu Buttons hinzu, um auf Klicks zu reagieren, um die fetchPokemons-Funktion auszulösen und Daten basierend auf dem geklickten Button zu laden.
buttons?.forEach((button: HTMLButtonElement) => {
    button?.addEventListener("click", () => {
        const buttonValue = button.value;
        fetchPokemons(buttonValue);
    });
});

// Event-Listener für Text-Eingabe:
// Fügt Event-Listener zum Text-Eingabefeld hinzu, um auf die Eingabe und Enter-Taste zu reagieren, um die fetchPokemonArr-Funktion auszulösen und Daten basierend auf der Benutzereingabe zu laden.
inputText.addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
        const textValue = inputText.value.trim().toLowerCase();
        fetchPokemonArr(textValue);
    }
});

inputText.addEventListener("input", () => {
    const textValue = inputText.value.trim().toLowerCase();
    fetchPokemonArr(textValue);
});

// Funktion zum Erstellen und Einfügen von Karten für jedes Pokémon:
// Diese Funktion erstellt DOM-Elemente für jedes Pokémon und fügt sie der Seite hinzu, um die abgerufenen Pokémon-Daten in Form von Karten anzuzeigen.
async function renderCards(pokemon: IPokemon, styleType: boolean) {
    const cardDiv = document.createElement("div") as HTMLDivElement;
    const cardImg = document.createElement("img") as HTMLImageElement;
    const cardId = document.createElement("p") as HTMLParagraphElement;
    const cardName = document.createElement("p") as HTMLParagraphElement;
    const cardType = document.createElement("div") as HTMLDivElement;
    const singleCardType = document.createElement("p") as HTMLParagraphElement;

    try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const pokemonType = data.types.map((obj: any) => obj.type.name);

        const id = pokemon.url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "");
        cardImg.setAttribute(
            "src",
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        );
        cardId.textContent = "#" + id.padStart(3, "0");
        cardName.textContent = pokemon.name;
        singleCardType.innerHTML = pokemonType.join("<br>");
        cardType.appendChild(singleCardType);

        cardDiv.classList.add("flex", styleType ? "cardDiv" : "pokedex");
        cardId.classList.add(styleType ? "cardId" : "pokedexCardId");
        cardName.classList.add(styleType ? "cardName" : "pokedexCardName");
        singleCardType.classList.add(styleType ? "singleCardType" : "pokedexSingleType");
        cardType.classList.add(styleType ? "cardType" : "pokedexType");

        cardDiv.append(cardImg, cardId, cardName, cardType);
        cardsWrapper.appendChild(cardDiv);
    } catch (error) {
        console.error("Fehler beim Rendern der Pokémon-Karte: ", error);
        cardDiv.innerHTML = "<p>Fehler beim Laden des Pokémon. Bitte versuche es später erneut.</p>";
        cardsWrapper.appendChild(cardDiv);
    }
}
