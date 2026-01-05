
export class SessionDO {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    // Get current storage value
    let value = (await this.state.storage.get<Record<string, any>>("data")) || {};

    if (request.method === "POST") {
      const data = (await request.json()) as Record<string, any>;
      value = { ...value, ...data };
      await this.state.storage.put("data", value);
    }

    return new Response(JSON.stringify(value), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
