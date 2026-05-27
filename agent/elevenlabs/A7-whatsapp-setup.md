# A7 — WhatsApp Channel Setup

## A7.2 — Connect ElevenLabs WhatsApp Integration

### What this does
Once connected, callers can WhatsApp the business number and the same AI receptionist
answers via WhatsApp — same agent, same knowledge base, same tools.

### Steps
1. ElevenLabs dashboard → **Conversational AI → Channels → WhatsApp**
2. Click **Add phone number** → connect a WhatsApp Business account
   - For the demo: use the **ElevenLabs shared sandbox number** (fastest)
   - For production: connect Joe's own WhatsApp Business account via Meta Business Manager
3. Assign the **Joe's Plumbing Receptionist** agent to the channel
4. Set an explicit **end-of-conversation message** to avoid silent timeouts:
   > "Thank you for contacting Joe's Plumbing! If you need anything else, just message us again. Have a great day!"
5. Save and test: WhatsApp the sandbox number → the agent should reply within 2 seconds

---

## A7.3 — send_whatsapp Tool (mid-call)

This tool lets the agent send a WhatsApp message **to the caller** during a phone call.
Use case: caller asks "Can you WhatsApp me your pricing?" or "Send me the address on WhatsApp."

### Add the tool in ElevenLabs

**Tool name:** `send_whatsapp`
**Description:** Send a WhatsApp message to the caller. Use this when they explicitly ask for
information to be WhatsApped to them (pricing, address, booking confirmation, quote, etc.).

**Method:** POST
**URL:** `https://www.voxelo.co.za/api/agent/whatsapp`

**Body parameters (JSON):**
```json
{
  "recipientPhone": "{{recipientPhone}}",
  "message": "{{message}}"
}
```

**Properties to define:**

| Identifier | Data type | Required | Description |
|---|---|---|---|
| `recipientPhone` | String | ✅ | The caller's WhatsApp number. Ask for it if not already collected. |
| `message` | String | ✅ | The message content to send — keep it concise and useful. |

---

## A7.4 — Compliance note

- Each tenant connects their **own** WhatsApp Business account — not a shared bot number.
- The AI is framed as "Joe's receptionist" — never as a general chatbot.
- Only business-relevant messages are sent (no marketing without consent).
- This framing satisfies the WhatsApp Business Policy requirement that the service must
  be an auxiliary to the actual business, not a standalone chatbot product.

---

## Testing A7 end-to-end

1. Call the Twilio number → ask "Can you WhatsApp me the callout fee?"
2. Agent asks for your WhatsApp number → give it
3. Agent calls `send_whatsapp` → you receive a WhatsApp within seconds
4. WhatsApp the ElevenLabs sandbox number → agent replies as normal
5. Check the ElevenLabs History for both conversation types (phone + WhatsApp)
