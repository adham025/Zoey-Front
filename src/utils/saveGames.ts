export function saveGame(gameState: any): void {
  const serializedState = localStorage.getItem("savedGames");
  let savedGames = [];
  if (serializedState) {
    savedGames = JSON.parse(serializedState);
  }
  savedGames.push(gameState);
  localStorage.setItem("savedGames", JSON.stringify(savedGames));
}

export function getSavedGame(): any | [] {
  const serializedState = localStorage.getItem("savedGames");
  if (serializedState) {
    return JSON.parse(serializedState);
  }
  return [];
}

export function isGameSaved(gameId: string): boolean {
  const serializedState = localStorage.getItem("savedGames");
  if (serializedState) {
    const savedGames = JSON.parse(serializedState);
    console.log(savedGames);
    return savedGames.find((game: any) => game.id === gameId) !== undefined;
  }
  return false;
}

export function removeSavedGame(gameId: string): void {
  const serializedState = localStorage.getItem("savedGames");
  if (serializedState) {
    const savedGames = JSON.parse(serializedState);
    const updatedGames = savedGames.filter((game: any) => game.id !== gameId);
    localStorage.setItem("savedGames", JSON.stringify(updatedGames));
  }
}
