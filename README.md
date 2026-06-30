# Atlas — Organizational Intelligence Agent for Slack

**Atlas** is an AI-powered organizational intelligence agent built for Slack. It analyzes real Slack channel activity to detect hidden operational risks, knowledge silos, documentation gaps, workflow bottlenecks, onboarding friction, and collaboration issues before they become business failures.

Atlas is not a generic chatbot. It is designed as a Slack-native organizational health monitor that turns everyday conversations into executive-ready intelligence.

## Project Summary

Modern teams often reveal their most important operational risks inside Slack before those risks appear in dashboards, tickets, reports, or meetings.

Atlas helps teams answer questions like:

* Who owns critical knowledge?
* Where are workflows blocked?
* What documentation is missing?
* Which approvals are slowing teams down?
* Are operational risks improving or escalating?
* What should leadership do next?

Atlas analyzes Slack conversations and generates:

* Organizational Health Reports
* Risk Radar Reports
* Executive Briefs
* Organizational Scorecards
* Dependency Maps
* 30-Day Operational Action Plans
* Trend Analysis

## Why Atlas Matters

Teams rarely fail because people are not working hard.

They fail because:

* critical knowledge gets trapped in a few people
* approvals silently become bottlenecks
* documentation falls behind reality
* new hires repeatedly ask the same questions
* leaders discover operational risk too late

Atlas helps teams detect those patterns directly inside Slack.

## Core Workflow

```
Slack conversations
        ↓
Atlas reads recent channel activity
        ↓
Atlas detects organizational signals
        ↓
Atlas identifies risks and dependencies
        ↓
Atlas generates reports, maps, action plans, and forecasts
        ↓
Teams act before small problems become business failures
```

## Key Features
### Real Slack Channel Analysis

Command:

```
@atlas analyze this channel
```

Atlas reads recent messages from the current Slack channel using the Slack Web API and generates an organizational health report.

It looks for:

* repeated questions
* unresolved issues
* approval delays
* documentation gaps
* workflow bottlenecks
* collaboration friction
* operational risks

### Risk Radar

Command:
```
@atlas risks
```
Atlas generates a prioritized organizational risk report, including:
* risk score
* severity
* signals
* business impact
* recommended interventions

###Executive Brief

Command:
```
@atlas executive summary
```
Atlas creates a leadership-ready summary with:
* organization health
* top risk
* biggest opportunity
* key metrics
* recommended leadership action

### Organizational Scorecard

Command:
```
@atlas scorecard
```
Atlas generates a scorecard across:
* collaboration health
* knowledge distribution
* documentation coverage
* workflow efficiency
* operational resilience
* onboarding readiness

### Dependency Map

Command:
```
@atlas map this channel
```
Atlas builds an organizational dependency map from Slack messages.

It identifies:
* knowledge hubs
* ownership areas
* operational bottlenecks
* topic clusters
* knowledge transfer opportunities

### Operational Action Plan

Command:
```
@atlas action plan
```
Atlas generates a practical 30-day operational improvement plan with:
* weekly actions
* suggested owners
* expected outcomes
* business impact
* leadership recommendation

### Trend Analysis

Command:
```
@atlas trends
```
Atlas analyzes whether organizational risks appear to be:
* improving
* stable
* escalating

It focuses on early signals around approvals, documentation, knowledge distribution, onboarding readiness, and workflow blockers.

### App Home Dashboard

Atlas includes a Slack App Home dashboard showing:
* organization health
* current status
* top risk
* top opportunity
* quick commands
* Slack-native usage instructions

## Example Demo Scenario

A demo engineering channel may include messages like:
```
Sarah: Can someone approve the API Gateway deployment? It has been waiting since Monday. Mike: I can’t approve it because Sarah is the only one who knows the rollback steps. Emily: Where is the deployment runbook? I asked last week too. Priya: New hires keep asking how to deploy to staging. Sarah: I can review tomorrow, but I’m overloaded today. John: The release is blocked until API Gateway approval is done.
```

Atlas detects:
* knowledge concentration around Sarah
* API Gateway approval bottleneck
* missing deployment runbook
* onboarding friction
* release delay risk

Atlas can then generate:
* an Organizational Health Report
* a Dependency Map
* an Operational Action Plan
* a Trend Analysis Forecast 

## Tech Stack
* Slack Bolt for JavaScript
* Slack Agent Builder starter template
* Slack Web API
* Slack App Home
* Slack Socket Mode
* OpenAI Agents SDK
* GPT-4.1 Mini
* Node.js
* JavaScript

## Slack Capabilities Used

Atlas uses Slack as the primary surface for organizational intelligence.

Core Slack capabilities:

* App mentions
* Slack assistant interface
* Slack App Home
* Message event handling
* Threaded responses
* Feedback buttons
* conversations.history for real channel analysis

The project is also structured for future extension through Slack MCP Server and Real-Time Search API integrations.

App Overview

Atlas interacts with users through four Slack entry points:

* **App Home** — Displays Atlas dashboard, project overview, and quick commands.
* **Direct Messages** — Users can message Atlas directly and continue threaded conversations.
* **Channel @mentions** — Users can mention Atlas inside a channel to analyze real channel activity.
* **Assistant Panel** — Users can interact with Atlas through Slack’s assistant interface.

## Setup

Before getting started, make sure you have a development workspace where you have permission to install Slack apps.

## Developer Program

Join the Slack Developer Program for access to sandbox environments, tooling, and resources for building and testing Slack apps.

## Create the Slack App
### Using Slack CLI

Install the latest version of the Slack CLI for your operating system:
* Slack CLI for macOS & Linux
* Slack CLI for Windows

Log in if this is your first time using the Slack CLI:
```
slack login
```
Create or initialize the project:
```
slack create atlas
cd atlas
```
If this is an existing Slack project, initialize it with:
```
slack init
```
### Using App Settings
1. Open Slack API app creation.
2. Choose From an app manifest.
3. Choose the workspace where you want to install Atlas.
4. Copy the contents of manifest.json into the JSON manifest editor.
5. Review the configuration and create the app.
6. Install the app to your workspace.
7. Copy the required tokens into .env.

### Environment Variables

Before running the app, create a `.env` file from `.env.sample`:
```
cp .env.sample .env
```
Add the required values:
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
SLACK_BOT_TOKEN=YOUR_SLACK_BOT_TOKEN
SLACK_APP_TOKEN=YOUR_SLACK_APP_TOKEN
```
Do not commit `.env`.

## Install Dependencies
```
npm install
```

## OpenAI Setup

Atlas uses OpenAI through the OpenAI Agents SDK.
1. Create an API key from the OpenAI dashboard.
2. Add the key to .env.
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

## Development
### Start the App with Slack CLI
```
slack run
```
### Start the App with Terminal
```
npm start
```

## OAuth HTTP Server Mode

Atlas can also run in HTTP mode instead of Socket Mode. This is useful for OAuth-based distribution.

### Using ngrok
1. Install ngrok.
2. Start a tunnel:
```
ngrok http 3000
```
3. Copy the https://*.ngrok-free.app URL.
4. Update `manifest.json`:
  * Set `socket_mode_enabled` to `false`
  * Replace `ngrok-free.app` with your `ngrok` domain
5. Update `.env`:
```
SLACK_CLIENT_ID=YOUR_CLIENT_ID
SLACK_CLIENT_SECRET=YOUR_CLIENT_SECRET
SLACK_REDIRECT_URI=https://YOUR_NGROK_SUBDOMAIN.ngrok-free.app/slack/oauth_redirect
SLACK_SIGNING_SECRET=YOUR_SIGNING_SECRET
```
6. Start the OAuth app:
```
slack run app-oauth.js
```
or:
```
node app-oauth.js
```
7. Click the install URL printed in the terminal.

  Note: Each time `ngrok` restarts, it generates a new URL. Update the ngrok domain in `manifest.json`, `SLACK_REDIRECT_URI`, and reinstall the app if needed.

## Using Atlas

Once Atlas is running, invite it to a channel:
```
/invite @atlas
```
Then try:
```
@atlas analyze this channel
@atlas risks
@atlas executive summary
@atlas scorecard
@atlas map this channel
@atlas action plan
@atlas trends
```
Atlas replies in a thread so the channel stays clean.

## Project Structure
```
manifest.json
```
Slack app configuration, including app features, OAuth scopes, event subscriptions, assistant view, App Home, Socket Mode, and MCP settings.
```
app.js
```
Main application entry point. It initializes the Slack Bolt app and registers listeners.
```
app-oauth.js
```
Alternative entry point for HTTP/OAuth mode. This is intended for deployments that use OAuth-based installation.
```
/listeners
```
Contains Slack request and event handlers.
```
/listeners/events
```
* `app-home-opened.js` — Publishes the Atlas App Home dashboard.
* `app-mentioned.js` — Handles channel @mentions and routes Atlas commands.
* `message.js` — Handles direct messages and threaded conversations.
* `assistant-thread-started.js` — Sets suggested prompts for assistant threads.
`/listeners/actions`
* `feedback-buttons.js` — Handles feedback interactions on Atlas responses.
`/listeners/views`
* `app-home-builder.js` — Builds the Atlas App Home dashboard.
* `feedback-builder.js` — Builds feedback button blocks attached to responses.
```
/agent
```
Contains the OpenAI Agents SDK setup.

* `agent.js` — Defines the Atlas agent, system prompt, model, and tools.
* `deps.js` — Defines runtime dependencies passed to the agent.
* `/tools` — Contains agent tools such as emoji reactions.
```
/thread-context
```
Stores in-memory conversation history by channel and thread, enabling multi-turn threaded conversations.

## Linting
```
npm run lint
```
Auto-fix lint and formatting issues:
```
npm run lint:fix
```

## Testing
```
npm test
```

## Security Notes

Never commit `.env`.

Use `.env.sample` only for placeholder values.

Recommended:

* `.env`
* `.env.*`
* `!.env.sample`
* `node_modules`

If an API key is ever committed or exposed, revoke it immediately and generate a new one.

## Troubleshooting
### Slack CLI says the project is not initialized

If you see:
```
If this is a Slack project, you can initialize it with `slack init`
```
run:
```
slack init
```
Then run:
```
slack run
```

### MCP Server connection error

If you see an error saying the app is not enabled for Slack MCP server access, enable MCP manually:

1. Run:
`slack app settings`
2. Open the app settings page.
3. Navigate to Agents & AI Apps.
4. Toggle Slack Model Context Protocol on.

Atlas does not require MCP for the main demo flow because real channel analysis uses Slack Web API channel history, but MCP can unlock broader future workspace intelligence.

### Slack manifest validation error for `search:read`

Slack does not allow `search:read` as a bot scope.

Keep search scopes under user scopes only.

Do not place this in bot scopes:

`"search:read"`

### OpenAI quota error

If you see a 429 quota or billing error, check OpenAI API billing and usage. ChatGPT Plus does not automatically include OpenAI API credits.

## Hackathon Track

Atlas is designed for the Slack Agent Builder Challenge as a new Slack agent.

It solves a specific workflow problem inside Slack: operational risks are hidden in everyday conversations, and leaders often discover them too late.

## Judging Criteria Alignment
### Technological Implementation

Atlas uses Slack Bolt, Slack Agent Builder, Slack Web API channel history, Slack App Home, threaded Slack responses, structured command routing, and the OpenAI Agents SDK.

### Design

Atlas provides a Slack-native experience through App Home, clean threaded reports, structured Markdown outputs, and clear commands.

### Potential Impact

Atlas can help engineering teams, operations teams, startups, nonprofits, schools, public sector teams, and enterprises identify operational risks earlier.

### Quality of Idea

Atlas improves on generic workplace AI assistants by focusing on organizational intelligence: risk detection, dependency mapping, documentation debt, workflow bottlenecks, and team resilience.

## Project Vision

Atlas aims to become an organizational health monitor for modern teams.

The long-term vision is a Slack-native intelligence layer that continuously maps how work actually happens, detects risks early, and helps teams become more resilient.