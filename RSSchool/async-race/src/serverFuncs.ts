export class ServerFunc {
  static address = 'http://127.0.0.1:3000';

  static garage = `${ServerFunc.address}/garage`;

  static winners = `${ServerFunc.address}/winners`;

  static engine = `${ServerFunc.address}/engine`;

  // garage

  static async getCars(
    page: number,
    limit = 7,
  ): Promise<{ count: string | null; carsArray: [{ name: string; color: string; id: number }] }> {
    const response = await fetch(`${this.garage}?_page=${page}&_limit=${limit}`);
    return {
      count: response.headers.get('X-Total-Count'),
      carsArray: await response.json(),
    };
  }

  static async getCar(id: number): Promise<{ name: string; color: string; id: string }> {
    return (await fetch(`${this.garage}/${id}`)).json();
  }

  static async createCar(name: string, color: string): Promise<void> {
    await fetch(this.garage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
  }

  static async deleteCar(id: number): Promise<void> {
    await fetch(`${this.garage}/${id}`, { method: 'DELETE' });
  }

  static async updateCar(id: number, name: string, color: string): Promise<void> {
    await fetch(`${this.garage}/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
  }

  // winners

  static async getWinners(
    page: number,
    sort = 'id',
    order = 'ASC',
    limit = 10,
  ): Promise<{ count: string | null; winnersArray: [{ id: number; wins: number; time: number }] }> {
    const response = await fetch(`${this.winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    return {
      count: response.headers.get('X-Total-Count'),
      winnersArray: await response.json(),
    };
  }

  static async getWinner(id: number): Promise<{ id: number; wins: number; time: number }> {
    const res = await fetch(`${this.winners}/${id}`);
    if (res.status === 404) {
      throw new Error('404');
    }
    return res.json();
  }

  static async createWinner(id: number, wins: number, time: number): Promise<void> {
    await fetch(this.winners, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, wins, time }),
    });
  }

  static async deleteWinner(id: number): Promise<void> {
    await fetch(`${this.winners}/${id}`, { method: 'DELETE' });
  }

  static async updateWinner(id: number, wins: number, time: number): Promise<void> {
    await fetch(`${this.winners}/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins, time }),
    });
  }

  // engine

  static async startEngine(id: number, status = 'started'): Promise<{ velocity: number; distance: number }> {
    return (await fetch(`${this.engine}?id=${id}&status=${status}`)).json();
  }

  static async stopEngine(id: number, status = 'stopped'): Promise<void> {
    await fetch(`${this.engine}?id=${id}&status=${status}`);
  }

  static async driveEngine(id: number, status = 'drive'): Promise<number> {
    const res = await fetch(`${this.engine}?id=${id}&status=${status}`);
    if (res.status === 404) {
      throw new Error('404');
    }
    if (res.status === 500) {
      throw new Error('500');
    }
    return 200;
  }
}
