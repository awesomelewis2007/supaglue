import { getOrgId } from '@/utils/org';
import { Application } from '@supaglue/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_HOST, SG_INTERNAL_TOKEN } from '../..';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ applications: Application[] } | null>
) {
  const orgId = getOrgId(req);
  switch (req.method) {
    case 'GET': {
      const result = await fetch(`${API_HOST}/internal/v1/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-sg-internal-token': SG_INTERNAL_TOKEN,
          'x-org-id': orgId,
        },
      });

      if (!result.ok) {
        return res.status(500).json(null);
      }

      const r = await result.json();

      return res.status(200).json(r);
    }
    case 'PUT': {
      const result = await fetch(`${API_HOST}/internal/v1/applications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-sg-internal-token': SG_INTERNAL_TOKEN,
          'x-org-id': orgId,
        },
        body: JSON.stringify({
          name: req.body.name,
        }),
      });

      if (!result.ok) {
        return res.status(500).json(null);
      }

      const r = await result.json();

      return res.status(200).json(r);
    }
    default:
      throw new Error(`Invalid method: ${req.method}`);
  }
}
