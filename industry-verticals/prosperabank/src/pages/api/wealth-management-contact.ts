import type { NextApiRequest, NextApiResponse } from 'next';

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  city?: string;
};

/** Placeholder handler for `WealthManagementFooter` contact POSTs; wire to email/CRM when ready. */
export default function handler(req: NextApiRequest, res: NextApiResponse<{ ok: boolean }>): void {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').end();
    return;
  }

  const body = req.body as ContactBody;
  if (body.city) {
    res.status(200).json({ ok: true });
    return;
  }

  res.status(200).json({ ok: true });
}
