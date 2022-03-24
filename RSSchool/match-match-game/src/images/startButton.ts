export function updateStartButton(gameInfo: { deleted: boolean }): void {
  const btn = document.querySelector('.button-start');
  if (btn) {
    btn.textContent = gameInfo.deleted ? 'start game' : 'stop game';
  }
}
