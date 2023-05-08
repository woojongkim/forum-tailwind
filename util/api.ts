import { NextApiRequest } from "next";

export async function readRequestBody(request: NextApiRequest): Promise<string> {
    const chunks = [];
    const reader = request.body?.getReader();
    if (!reader) return '';
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  
    const body = new TextDecoder().decode(new Uint8Array(chunks.flat()));
    return body;
  }