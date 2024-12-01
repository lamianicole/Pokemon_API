export interface IPokeAPI {
    count: number;
    next: string;
    previous: null;
    results: IPokemon[];
}

export interface IPokemon {
    name: string;
    url: string;
}
// -------------------------------------
export interface IPokemonType {
    game_indices: any[];
    generation: IPokemon;
    id: number;
    moves: any[];
    name: string;
    names: any[];
    past_damage_relations: any[];
    pokemon: IPokemonPokemon[];
}

export interface IPokemonPokemon {
    pokemon: IPokemon;
    slot: number;
}