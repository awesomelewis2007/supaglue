import type { NextApiRequest, NextApiResponse } from 'next';
import { API_HOST, SG_INTERNAL_TOKEN } from '../..';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const result = await fetch(`${API_HOST}/internal/v1/api_keys/_generate_api_key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-application-id': req.headers['x-application-id'] as string,
      'x-sg-internal-token': SG_INTERNAL_TOKEN,
    },
  });

  if (!result.ok) {
    return res.status(500).json({ error: 'Failed to create' });
  }

  const r = await result.json();

  return res.status(200).json(r);
}