---
id: model-context-protocol
title: Model Context Protocol
summary: An open, model-neutral protocol for connecting AI applications to tools, data sources, and reusable prompt templates.
locale: en
kind: technology
revision: 1
categories:
  - software
  - artificial-intelligence
aliases:
  - MCP
  - Model Context Protocol (MCP)
redirects:
  - mcp
related:
  - anthropic
  - agentic-ai-foundation
infobox:
  fields:
    - key: developer
      value: Anthropic (originator); community-governed under the Agentic AI Foundation
    - key: initial_release
      value: 25 November 2024
    - key: technologies
      value:
        - JSON-RPC 2.0
        - Stateless client-host-server architecture
        - Standard input/output and Streamable HTTP
        - Per-request capability negotiation
    - key: license
      value: MIT (specification and documentation repository)
    - key: status
      value: Active open standard; version 2026-07-28 current as of 9 August 2026
    - key: website
      value:
        text: modelcontextprotocol.io
        url: https://modelcontextprotocol.io/
---

The **Model Context Protocol** (**MCP**) is an open protocol through which an AI application can
discover and use external data, operations, and reusable prompt templates. An MCP server might expose
files from a repository, database schemas, a web-search operation, or a command that changes an issue
tracker. An MCP host connects those capabilities to a language model and decides what the model and
user may see or invoke.[^specification]

MCP does not train a model, enlarge its context window, or make a model into an autonomous agent. It
standardizes the connection between an AI application and integrations that would otherwise require
product-specific adapters. The host still chooses the model, assembles its context, runs the agent
loop, presents consent controls, and enforces policy. The server still implements the underlying API,
database query, or local operation.

[Anthropic](/anthropic/) introduced MCP on 25 November 2024 and open-sourced its specification,
software-development kits, and example servers. David Soria Parra and Justin Spahr-Summers created
the protocol at Anthropic.[^origin] In December 2025, Anthropic contributed it to the **[Agentic AI
Foundation](/agentic-ai-foundation/)** (**AAIF**), a Linux Foundation directed fund founded with
Block and OpenAI. The move gave the project a vendor-neutral governance home; Anthropic remained a
contributor rather than the sole owner of the standard.[^aaif]

## Why a protocol is useful

Before a shared protocol, each pairing of AI product and external service could require a separate
connector. If three assistants all needed to work with the same source-code host, their developers
might independently implement discovery, schemas, authentication, invocation, and error handling.
MCP attempts to make the integration reusable: the service implements an MCP server, while each AI
application implements an MCP client.

This resembles the role of the Language Server Protocol in development tools. A language server does
not replace a compiler or editor; it supplies a common interface between them. Likewise, MCP does not
replace a service's ordinary API or an AI application's orchestration logic. It supplies a common
wire protocol and vocabulary between the two.[^specification]

The abstraction has practical limits. Two servers can both conform to MCP while exposing different
tool names, descriptions, schemas, authorization scopes, and behavior. Protocol compatibility is not
semantic equivalence, and it does not guarantee that a model will select a tool correctly.

## Architecture

The current stable protocol uses a **host–client–server** architecture:[^architecture]

- The **host** is the user-facing AI application. It creates clients, coordinates the language model,
  aggregates context, applies permissions, and isolates server connections.
- An MCP **client** is a connector inside the host. Each client communicates with exactly one server,
  attaches protocol metadata to its requests, and maintains the security boundary between that
  server and the rest of the host.
- An MCP **server** is a local process or remote service that exposes a focused set of capabilities.
  One server might wrap a filesystem, another a design application, and another a hosted business
  service.

This terminology can be counterintuitive. A desktop assistant is the **host**, while the code inside
it that speaks to a particular integration is the **client**. The external integration is the
**server**, even when it runs as a child process on the same computer.

The architecture intentionally keeps orchestration in the host. A server ordinarily receives only
the requests and context needed for its own work; it is not automatically entitled to the entire
conversation or to the output of other servers. Whether that separation is effective depends on the
host's implementation and on the real operating-system and network privileges granted to each
server.[^architecture]

MCP `2026-07-28` is stateless at the protocol level. A connection, HTTP stream, or `stdio` process is
not a conversation or session, and a server must not infer context from earlier requests on the same
transport. State that must survive across requests is represented by an explicit identifier that the
client sends again, such as an application handle or a task identifier.[^base-protocol]

### Messages, versioning, and capabilities

MCP messages use **JSON-RPC 2.0** requests, responses, and notifications. The current revision has no
`initialize`/`initialized` handshake. Every request declares its date-formatted protocol version and
the client's capabilities in `_meta`; clients should also include their implementation identity.
The server independently accepts the version or returns an `UnsupportedProtocolVersionError` naming
the versions it supports.[^versioning]

Every server must implement `server/discover`, which reports its supported versions, capabilities,
identity, and optional usage instructions. Calling it is optional for a client: the client may send
an ordinary request immediately and handle a version error instead. Discovery is especially useful
as a compatibility probe when a client also supports handshake-based versions from `2025-11-25` and
earlier.[^discovery][^versioning]

Capability negotiation lets a minimal server implement only tools, for example, while another offers
resources, prompts, and change notifications. Client capabilities also indicate which requests for
additional input it can satisfy. Optional extensions are advertised by identifier in the
`extensions` capability map. A peer must not use a feature the other side did not declare.
Negotiation reduces accidental incompatibility, but an advertised capability is a technical
claim—not evidence that the implementation is safe or correct.

### Transports

The stable specification defines two standard transports:[^transports]

- **Standard input/output (`stdio`)**: the client launches a local server process and exchanges one
  newline-delimited JSON-RPC message at a time through its standard streams. Logs belong on standard
  error because standard output is reserved for protocol messages.
- **Streamable HTTP**: each client request or notification is a separate `POST` to one MCP endpoint.
  A request receives either one JSON object or a Server-Sent Events stream scoped to that request.
  The protocol defines no HTTP `GET` stream and no session shared across requests.

`stdio` is simple and useful for local tools, but installing a local server is equivalent to
installing software that runs with whatever privileges its process receives. Streamable HTTP avoids
shipping the server executable to the user and fits centrally managed services, but introduces
network authentication, tenant isolation, availability, and latency concerns.

On Streamable HTTP, the request body remains the source of truth, while the
`MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` headers mirror routing metadata. Long-lived
change notifications use the response stream of a client-initiated `subscriptions/listen` request;
request-specific progress and logging notifications remain on the originating request's response
stream.[^streamable-http]

The older `HTTP+SSE` transport is deprecated in favor of Streamable HTTP. Compatibility code remains
important because hosts, servers, and language-specific SDKs do not all adopt a new protocol revision
simultaneously.[^transports][^versioning]

## Server primitives

The three best-known MCP primitives describe different kinds of server contribution. The
specification suggests a typical control pattern, but does not force a particular interface:[^prompts][^resources][^tools]

| Primitive     | What the server exposes                                      | Typical controller |
| ------------- | ------------------------------------------------------------ | ------------------ |
| **Prompts**   | Parameterized message templates and reusable workflows       | User               |
| **Resources** | URI-addressed text or binary context                         | Host application   |
| **Tools**     | Named operations with structured inputs and optional outputs | Language model     |

### Prompts

A prompt definition has a name, optional description, and optional arguments. Fetching it produces
one or more messages that may contain text, images, audio, or embedded resources. A host might expose
these templates as slash commands that a user explicitly selects. An MCP prompt is therefore a
server-provided workflow template, not the host's hidden system prompt and not a method for changing
model weights.[^prompts]

### Resources

A resource is identified by a URI and supplies text or binary data such as a file, database schema,
repository object, or application record. Servers can offer concrete resources and parameterized
resource templates. A client can receive list changes or updates for selected resources through a
`subscriptions/listen` request. The host decides whether to show, search, fetch, or place that
material into model context.[^resources]

Resources can support retrieval-augmented generation, but MCP is not itself a retrieval algorithm.
It does not prescribe embeddings, an index, ranking, chunking, or how much retrieved material should
enter the prompt. Those choices remain with the server and host.

### Tools

A tool has a name, description, and JSON Schema for its input; it may also declare a schema for
structured output. A client can list tools and call one with JSON arguments. Results can contain
text, images, audio, resource links, embedded resources, or structured content.[^tools]

Tools are described as **model-controlled** because a host may let the language model decide when to
request them. The protocol does not require automatic execution. Its specification recommends that
applications reveal which tools are available, show invocations, and retain a human's ability to
deny them—especially when an operation has side effects.[^tools]

## Client input and multi-round-trip requests

MCP remains bidirectional, but in `2026-07-28` a server does not initiate a JSON-RPC request. If a
server needs more information while processing `prompts/get`, `resources/read`, or `tools/call`, it
returns an `InputRequiredResult` with `resultType: "input_required"`. Its `inputRequests` map describes
the information needed, and an optional opaque `requestState` lets the server carry explicit state.
The client obtains any permitted input and retries the original operation with matching
`inputResponses`. Each round remains an independent request.[^mrtr]

This **Multi Round-Trip Requests** (**MRTR**) pattern can carry three kinds of client input:

- **Elicitation** asks the host to collect information from the user. Form mode requests structured
  data; URL mode directs the user to an external page for sensitive interactions that should not pass
  through the MCP client.[^elicitation]
- **Roots** describe filesystem locations relevant to a workspace. A root is only a declared
  boundary, not an operating-system sandbox; a local process with broader filesystem permissions can
  still ignore it.
- **Sampling** asks the host to run a language-model generation while the host retains model
  credentials, model choice, permission handling, and control over the prompt and result.

Elicitation remains an active client feature. Roots and Sampling are deprecated in `2026-07-28`, as
is the Logging feature. Existing implementations may use them during the deprecation window, but new
implementations should instead pass files or directories through tool parameters, resource URIs, or
server configuration; integrate directly with model-provider APIs; and use standard error or
OpenTelemetry for observability. Their earliest eligible removal is the first revision released on
or after 28 July 2027.[^deprecated]

## A typical tool call

A simplified MCP interaction proceeds as follows:

1. The user enables a trusted local or remote server in an MCP-capable host.
2. The client optionally calls `server/discover`, or sends an ordinary request carrying its preferred
   protocol version and client capabilities.
3. The client requests `tools/list`; the server returns names, descriptions, input schemas, and cache
   hints.
4. The host makes selected tool descriptions available to its language model.
5. The model proposes a tool name and arguments. The host applies policy and, where appropriate,
   requests user confirmation before sending `tools/call`.
6. If more user, model, or root input is needed, the server returns `input_required`; the client
   satisfies allowed requests and retries `tools/call`.
7. The server validates authorization and inputs, performs the underlying operation, and returns a
   `complete` result. The host decides how much of that result to give the model or user.

Only the client–server messages are standardized by MCP. Steps such as model selection, confirmation
UI, retry logic, context management, and the agent loop are host behavior.

## MCP compared with adjacent concepts

**An API** defines how software accesses a particular service. An MCP server often wraps one or more
APIs and presents selected operations through MCP. This can improve portability across AI hosts, but
adds another layer that must preserve the API's authentication, error semantics, rate limits, and
data types.

**Tool calling** or **function calling** is the model-facing mechanism by which a model emits a
structured request for an operation. MCP can deliver tool definitions and results to a host, but the
host must translate them into the format its chosen model supports and decide whether to execute the
request. Either concept can exist without the other.

**Retrieval-augmented generation** is a pattern for selecting external information and adding it to
a model request. MCP resources or tools can supply the information, but the protocol does not specify
the retrieval pipeline.

**An agent framework** controls a sequence of model calls, tools, state, and decisions. MCP supplies
interoperable connections that such a framework may use; it does not define the agent's goals,
planning method, memory, or stopping condition.

**A plugin marketplace** handles discovery, distribution, review, installation, and trust decisions.
MCP defines a protocol and a public registry exists, but protocol conformance alone is not a security
review or endorsement of a server.

## Costs and trade-offs

MCP can reduce duplicated integration work and vendor lock-in. A focused server can be reused by
multiple hosts and models, while a host can combine local and remote services through one family of
messages. Official SDKs in several programming languages reduce the amount of protocol machinery an
implementer must write.[^repository]

The common layer also creates costs:

- **Implementation and maintenance**: someone must still map the underlying service into coherent
  prompts, resources, or tools, test schemas, handle authorization, and track specification and SDK
  versions.
- **Latency and reliability**: remote calls add network round trips; every server and downstream API
  becomes another failure point. Timeouts, cancellation, idempotency, and partial failure need
  deliberate handling.
- **Context and inference cost**: tool descriptions, resource contents, and results consume model
  tokens. Exposing hundreds of tools at once can make selection less reliable as well as more
  expensive, so hosts often filter, search, or load capabilities on demand.
- **Abstraction loss**: a generic connector can hide useful service-specific behavior. Complex
  workflows may still need a purpose-built client or direct API integration.
- **Operational cost**: remote servers need hosting, monitoring, rate limiting, credential rotation,
  audit logs, and tenant isolation. Local servers shift installation and process-security burdens to
  the host and user.
- **Portability gaps**: hosts implement different subsets of MCP and present consent differently;
  servers may depend on extensions or newer revisions. “Supports MCP” does not imply identical user
  experience.

For a small integration used by one application, a direct function call may be clearer. MCP becomes
more valuable when the same capability should work across multiple AI hosts, when dynamic discovery
matters, or when local and remote integrations need a consistent interface.

## Security and trust

MCP connects probabilistic models to data access and potentially destructive operations, so its most
important boundary is not message syntax but authority. The core specification calls for explicit
user consent over data sharing and actions, warns that tool descriptions are untrusted, and states
that the protocol cannot enforce all of its safety principles by itself.[^specification]

For remote HTTP servers, the stable authorization specification builds on OAuth-related standards.
A protected MCP server acts as a resource server, the MCP client as an OAuth client, and a separate
or colocated authorization server issues access tokens. HTTP implementations should follow this
framework, whereas `stdio` implementations should obtain credentials from the environment.
Authorization remains optional at the protocol level, but a server that exposes private data or
privileged operations still needs an appropriate access-control system.[^authorization]

When authorization is used, the current revision requires protected-resource metadata and
strengthens authorization-server issuer validation. It prefers Client ID Metadata Documents or
pre-registration; Dynamic Client Registration remains available only for compatibility and is
deprecated. Client credentials must be bound to the authorization server that issued them rather
than reused across issuers.[^authorization][^changelog]

The project's security guidance discusses confused-deputy attacks, token passthrough, server-side
request forgery, local-server compromise, overly broad scopes, and prompt injection. In particular, a
server must not accept and forward a token that was issued for a different downstream service;
separate audiences preserve security controls and auditability.[^security]

Practical defenses include:

- installing or connecting only to servers whose code and operator are trusted;
- granting the smallest filesystem, network, account, and OAuth scope needed;
- validating tool arguments, resource URIs, outputs, redirect destinations, and token audiences;
- requiring confirmation for consequential or surprising operations;
- keeping untrusted tool results and resource text distinct from higher-priority instructions;
- sandboxing local processes where feasible and avoiding secrets in command-line arguments or logs;
  and
- using timeouts, rate limits, audit trails, revocation, and per-user isolation.

An MCP server can truthfully follow the wire specification and still be malicious, vulnerable, or
overprivileged. MCP is an interoperability layer, not a trust certificate.

## Versions and current relevance

MCP versions use dates representing backward-incompatible changes. Version `2026-07-28` was released
on 28 July 2026 and is the current specification as of 9 August 2026. It is the first **modern**
revision in the project's compatibility terminology: it uses stateless, per-request metadata, while
`2025-11-25` and earlier are **legacy** revisions that establish a session through `initialize`.
Implementations may support both eras, but a legacy-only client cannot communicate with a
modern-only server.[^release][^versioning]

The release also introduced header-based HTTP routing, cache metadata on list and resource results,
MRTR, `subscriptions/listen`, and a formal extensions framework. Long-running **Tasks** moved from
the experimental core into the `io.modelcontextprotocol/tasks` extension, with poll-based retrieval
and explicit updates. Other opt-in extensions include MCP Apps for interactive interfaces. Extension
support is declared through capabilities and requires both parties to agree on the extension's
behavior.[^changelog][^extensions]

The same release formalized a feature lifecycle with a minimum twelve-month deprecation window.
Roots, Sampling, Logging, Dynamic Client Registration, and the legacy HTTP+SSE transport remain
documented for compatibility but are deprecated; new implementations should follow their published
migration paths.[^deprecated]

MCP's significance no longer rests only on Anthropic's products. At the AAIF launch in December
2025, the Linux Foundation reported adoption in Claude, Cursor, Microsoft Copilot, Gemini, Visual
Studio Code, ChatGPT, and other platforms, along with more than 10,000 published servers.[^aaif]
That reach helps explain why MCP became a relevant common layer for hobbyist tools, developer agents,
and enterprise integrations within little more than a year of its release.

## References

[^specification]: [Model Context Protocol specification: overview](https://modelcontextprotocol.io/specification/2026-07-28), version 2026-07-28, Model Context Protocol.

[^origin]: [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol), Anthropic, 25 November 2024.

[^aaif]: [Linux Foundation announces the formation of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), Linux Foundation, 9 December 2025.

[^architecture]: [Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture), Model Context Protocol specification, version 2026-07-28.

[^base-protocol]: [Base protocol overview](https://modelcontextprotocol.io/specification/2026-07-28/basic), Model Context Protocol specification, version 2026-07-28.

[^transports]: [Transport overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports), Model Context Protocol specification, version 2026-07-28.

[^streamable-http]: [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http), Model Context Protocol specification, version 2026-07-28.

[^versioning]: [Versioning and compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning), Model Context Protocol specification, version 2026-07-28.

[^discovery]: [Server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover), Model Context Protocol specification, version 2026-07-28.

[^prompts]: [Prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts), Model Context Protocol specification, version 2026-07-28.

[^resources]: [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), Model Context Protocol specification, version 2026-07-28.

[^tools]: [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), Model Context Protocol specification, version 2026-07-28.

[^mrtr]: [Multi Round-Trip Requests](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr), Model Context Protocol specification, version 2026-07-28.

[^elicitation]: [Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation), Model Context Protocol specification, version 2026-07-28.

[^deprecated]: [Deprecated features](https://modelcontextprotocol.io/specification/2026-07-28/deprecated), Model Context Protocol specification, version 2026-07-28.

[^repository]: [Model Context Protocol specification and documentation repository](https://github.com/modelcontextprotocol/modelcontextprotocol), GitHub; MIT licensed.

[^authorization]: [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization), Model Context Protocol specification, version 2026-07-28.

[^security]: [Security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices), Model Context Protocol documentation.

[^changelog]: [Key changes in 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog), Model Context Protocol specification.

[^extensions]: [MCP extensions](https://modelcontextprotocol.io/extensions), Model Context Protocol.

[^release]: David Soria Parra and Den Delimarsky, [The 2026-07-28 specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/), Model Context Protocol Blog, 28 July 2026.
