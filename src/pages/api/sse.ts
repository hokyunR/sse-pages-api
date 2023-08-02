import type { NextApiRequest, NextApiResponse } from "next";
import EventEmitter from "events";

export const config = {
  api: {
    externalResolver: true,
  },
};

let clients: { id: string; res: NextApiResponse }[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      clients.forEach((client) => {
        client.res.write(`event: event\n`);
        client.res.write(`data: ${JSON.stringify(req.body)}\n\n`);
      });

      res.end("SUCCESS");

      break;
    }
    case "GET": {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const id = `${new Date().toISOString()}`;
      const client = { id, res };

      clients.push(client);

      console.log(`Client connected: ${id}`);
      console.log(`Number of clients: ${clients.length}`);

      req.socket.on("close", () => {
        console.log(`Client disconnected: ${id}`);
        clients = clients.filter((client) => client.id !== id);
        console.log(`Number of clients: ${clients.length}`);
      });

      break;
    }
    default: {
      res.status(404).end("NOT_FOUND");
    }
  }
}
