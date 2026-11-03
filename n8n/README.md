# n8n: chat with a custom OpenAI-compatible LLM

Two importable workflows for `https://llmapi.sanattudu.tech/v1/chat/completions`.
Neither file contains the API key — the key lives in an n8n **credential** (the auth
form), so it is encrypted at rest and never travels in an export.

## Which one to use

| File | Approach | Use when |
|---|---|---|
| `custom-llm-chat-http.json` | Chat Trigger → HTTP Request (Header Auth) → Set | You want full control of the request body, or the OpenAI node rejects `"model": "auto"`. Works with any OpenAI-shaped API, however non-standard. |
| `custom-llm-chat-agent.json` | Chat Trigger → AI Agent → OpenAI Chat Model + Buffer Memory | You want conversation memory, tools, or anything else from n8n's LangChain nodes. Requires the API to be close enough to OpenAI's schema. |

## Setup: `custom-llm-chat-http.json`

1. **Create the credential** — Credentials → New → **Header Auth**:
   - **Name:** `Authorization`
   - **Value:** `Bearer YOUR_NEW_KEY`  (include the word `Bearer` and one space)
   - Save it as `Custom LLM API (Header Auth)`.
2. Import the workflow (Workflows → ⋯ → Import from File).
3. Open **Call custom LLM** and pick that credential from the dropdown. The
   `REPLACE_WITH_YOUR_CREDENTIAL_ID` placeholder in the file is only there to show where
   it binds; selecting it in the UI overwrites it.
4. Click **Chat** at the bottom of the canvas and send a message.

The HTTP node sends:

```json
{ "model": "auto", "messages": [ {"role":"system", ...}, {"role":"user", "content": "<chatInput>"} ] }
```

The **Extract reply** node pulls `choices[0].message.content` into a field named `output`,
which is what the chat trigger renders. It also surfaces `model_used` and `total_tokens`
so you can see which upstream model `auto` resolved to.

## Setup: `custom-llm-chat-agent.json`

1. **Create the credential** — Credentials → New → **OpenAI**:
   - **API Key:** your new key (just the key, no `Bearer`)
   - **Base URL:** `https://llmapi.sanattudu.tech/v1`  ← the important part
   - Save as `Custom LLM (sanattudu)`.
2. Import, then select that credential on the **Custom LLM (OpenAI-compatible)** node.
3. The model field is set to `auto`. If your n8n version renders it as a dropdown that
   tries to list models, it will call `GET /v1/models`. If your gateway doesn't implement
   that route the list comes back empty — switch the field to expression mode and type
   `auto`, or use the HTTP workflow instead.

## Caveats, honestly

- **Not tested against your live API.** The environment I built these in blocks outbound
  access to `llmapi.sanattudu.tech`, so the JSON is structurally validated (schema, node
  types, connection graph) but no request was ever made. Expect to adjust one or two
  fields on first run.
- **`"model": "auto"`** is not part of the OpenAI spec. The HTTP workflow passes it
  through verbatim. The OpenAI node may validate the value against a model list first,
  which is the main reason the HTTP route is the safer default.
- **Streaming is off.** Both send a single non-streamed request. For token-by-token
  output in the chat UI you'd set `"stream": true` and handle SSE, which the plain HTTP
  Request node does not parse.
- **Memory only exists in the Agent workflow.** The HTTP workflow is stateless — each
  message is a fresh request with no history. To add history there, insert a
  `memoryBufferWindow` or build the `messages` array from previous executions yourself.
- **`public: true`** on the chat trigger exposes a hosted chat URL. Set it to `false` if
  you only want to test from inside the n8n editor.

## Rotate the key

The key used while writing this was pasted into a chat transcript, so it should be
considered compromised. Issue a new one and put only the new one in the credential.
