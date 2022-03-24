import { addPositions } from './addPosition';

export function addResultat(player: {
  firstName: string;
  lastName: string;
  email: string;
  img64: string;
  result: number;
}): void {
  const openRequest = indexedDB.open('pabizolka', 1);
  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;
    db.createObjectStore('players');
  };
  openRequest.onerror = () => {};
  openRequest.onsuccess = () => {
    const db = openRequest.result;
    const transaction = db.transaction('players', 'readwrite');
    const players = transaction.objectStore('players');
    const request = players.openCursor();
    const res = player.result;
    let key = -1;
    let temp1 = player;
    let temp2 = player;
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        if (cursor.value.result < res) {
          key++;
          temp1 = cursor.value;
          players.put(temp2, key);
          temp2 = temp1;
          cursor.continue();
        } else {
          key++;
          cursor.continue();
        }
      } else {
        players.put(temp1, ++key);
      }
    };
  };
}

export function getTop(parent: HTMLElement): void {
  const openRequest = indexedDB.open('pabizolka', 1);
  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;
    db.createObjectStore('players');
  };
  openRequest.onerror = () => {};
  openRequest.onsuccess = () => {
    const db = openRequest.result;
    const transaction = db.transaction('players', 'readwrite');
    const players = transaction.objectStore('players');
    const request = players.getAll(IDBKeyRange.upperBound(10, false));
    request.onsuccess = () => {
      const arr = request.result;
      addPositions(arr, parent);
    };
  };
}
