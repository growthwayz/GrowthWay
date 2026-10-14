# Growthway retrieval chatbot

The first stage implements company Q&A, conversational service suggestions, and a contact-page handoff. It uses LangChain, Groq, the existing MongoDB rate limiter, and the owner's DOCX. `/recommend`, `/brief`, and `/search` intentionally have no implementation or demo responses.

## Configuration

Use Python 3.11 or newer. Install `requirements.txt` in the backend environment. Configure these backend environment variables (never frontend variables):

```env
AI_ENABLED=true
AI_PROVIDER=groq
AI_API_KEY=your-private-groq-key
AI_MODEL=openai/gpt-oss-20b
```

The model must support Groq JSON-schema output. Restart the backend after changing environment settings. AI remains disabled by default. Missing configuration or an unreadable document disables chat while allowing the rest of the application to start. `/api/ai/status` reports whether the local service initialised, not whether Groq is currently reachable or the key is valid.

`AI_KNOWLEDGE_PATH` defaults to `app/info/Growthway_Retrieval_Knowledge_v1.1.docx`, resolved relative to the backend directory. Keep the file out of publicly served frontend assets. The application never modifies it. Keep stable `GW001` / `FAQ01` style entry headings and a `Source register` heading. The reader indexes entries and preserves filename, version and record IDs; the document's register is not a searchable answer. It does not invent per-record attribution where the source document lacks it.

## Request flow

1. Validate message, session identifier, roles, and history size; apply shared database IP and supplementary IP/session rate limits.
2. Retrieve relevant DOCX entries with LangChain BM25 and a small vocabulary normalisation map. Discard zero-overlap results and near-duplicate entries.
3. Supply evidence and the published, non-placeholder service slug/title allowlist to Groq. Only previous user text helps resolve follow-up intent; submitted assistant history is ignored.
4. Validate evidence IDs, service slugs, length, and prohibited contact/link content. A second Groq call checks grounding, scope and safety. Return a fixed contact fallback if rejected.
5. Return plain text, fixed safe suggestions, `/contact`, and evidence record IDs. The model has no tools or authority to submit enquiries or access private collections.

The in-memory index is built at startup and rebuilt on document modification. Invalid or missing replacements fail the request rather than serving stale knowledge. Each worker keeps its own index and concurrency bound; MongoDB limits are shared. Proxy deployments must configure trusted proxy handling so the limiter uses the actual client address. Client-generated session IDs are not authentication.

## Limits and privacy

Defaults are 2,000 characters per message, six history entries with an 8,000-character total budget, five retrieved entries, 10 requests per IP per minute and 20 per IP/session per hour. The widget sends at most three previous messages. Generation and review share a 25-second deadline and four concurrent requests per worker. Successful answers usually cost two model calls. Each stage can retry once for malformed JSON or transient connection/server errors, within that same deadline. Quota and non-recoverable configuration errors are not retried. Provider rate limits return 429; overall deadlines return 504.

The default output budget is 2,048 tokens, including reasoning. GPT-OSS uses low reasoning effort and native strict JSON schemas, followed by Pydantic validation. Other configured models use the existing JSON-schema path and must support that format. Reply length remains limited to 1,500 characters. Logs record stage, exception class and allowlisted provider error codes, never raw provider messages or generated content.

To run an opt-in real-provider check: `.\.venv\Scripts\python.exe tests/live_ai_probe.py`. This makes billable Groq calls for two fixed public example questions, with fixture services and no MongoDB access. It is separate from the offline test suite.

No chat transcripts are persisted. Logs record error types only, and LangSmith tracing is disabled for chat execution. Groq receives the question, recent user context and retrieved public company content; the widget asks visitors to avoid sensitive information. The document and service allowlist do not include leads, accounts, or admin logs.

Keyword retrieval and model-based safety checks are not guarantees against hallucinations or adversarial inputs. Semantic search, a dedicated moderation model, approved case-study ingestion, structured brief submission, verified WhatsApp integration and shared fleet-wide concurrency controls remain future work. The original supplied WhatsApp placeholder is not used by the chat widget.

## Verification

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Tests use the actual company document, mocked Groq calls and isolated in-memory databases. They do not validate a live Groq credential or real-model answer quality. Before public activation, evaluate representative and adversarial conversations with the configured provider, and verify latency, refusal quality and source support.
