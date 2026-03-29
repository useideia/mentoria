export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const TELEGRAM_TOKEN = Netlify.env.get('TELEGRAM_TOKEN')
  const TELEGRAM_CHAT_ID = Netlify.env.get('TELEGRAM_CHAT_ID')

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    const data = await req.json()
    const { nome, whatsapp, motivacao, fase, contexto, gargalo, financeiro, expectativa } = data

    const msg = `🔔 *Nova aplicação — Mentoria*

*Nome:* ${nome}
*WhatsApp:* ${whatsapp}

*01 — Motivação:*
${motivacao}

*02 — Fase do negócio:*
${fase}

*Contexto do negócio:*
${contexto}

*03 — Gargalo:*
${gargalo}

*04 — Capacidade financeira:*
${financeiro}

*05 — Expectativa:*
${expectativa}`

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' }),
    })

    if (!response.ok) {
      return Response.json({ error: 'Failed to send message' }, { status: 502 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const config = {
  path: '/api/submit-application',
  method: 'POST',
}
