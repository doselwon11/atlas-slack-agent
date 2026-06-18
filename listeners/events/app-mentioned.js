import { AgentDeps, runAgent } from '../../agent/index.js';
import { conversationStore } from '../../thread-context/index.js';
import { buildFeedbackBlocks } from '../views/feedback-builder.js';

/**
 * Handle app_mention events and run the agent.
 * @param {import('@slack/bolt').AllMiddlewareArgs & import('@slack/bolt').SlackEventMiddlewareArgs<'app_mention'>} args
 * @returns {Promise<void>}
 */
export async function handleAppMentioned({ client, context, event, logger, say, sayStream, setStatus }) {
  try {
    const channelId = event.channel;
    const text = event.text || '';
    const threadTs = event.thread_ts || event.ts;
    const userId = /** @type {string} */ (context.userId);

    const cleanedText = text.replace(/<@[A-Z0-9]+>/g, '').trim();
    const lowerText = cleanedText.toLowerCase();

    if (!cleanedText) {
      await say({
        text: 'Atlas is ready. Try `analyze this channel`, `risks`, `scorecard`, `map this channel`, `action plan`, or `trends`.',
        thread_ts: threadTs,
      });
      return;
    }

    await setStatus({
      status: 'Analyzing workspace signals…',
      loading_messages: [
        'Reading recent channel activity…',
        'Looking for repeated questions…',
        'Detecting workflow bottlenecks…',
        'Mapping organizational dependencies…',
        'Preparing Atlas intelligence report…',
      ],
    });

    const runAndStream = async (agentInput) => {
      const deps = new AgentDeps(client, userId, channelId, threadTs, event.ts, context.userToken);
      const result = await runAgent(agentInput, deps);

      const streamer = sayStream();
      await streamer.append({ markdown_text: result.finalOutput });
      const feedbackBlocks = buildFeedbackBlocks();
      await streamer.stop({ blocks: feedbackBlocks });

      conversationStore.setHistory(channelId, threadTs, result.history);
    };

    const getRecentChannelMessages = async (limit = 100, sliceLimit = 60) => {
      try {
        const historyResult = await client.conversations.history({
          channel: channelId,
          limit,
        });

        return (historyResult.messages || [])
          .filter((m) => m.text && !m.bot_id)
          .slice(0, sliceLimit)
          .map((m, i) => {
            const user = m.user ? `<@${m.user}>` : 'unknown_user';
            const messageText = m.text.replace(/\s+/g, ' ').trim();
            return `${i + 1}. ${user}: ${messageText}`;
          });
      } catch (historyError) {
        logger.error(`Failed to read channel history: ${historyError}`);
        return [];
      }
    };

    if (
      lowerText.includes('analyze this channel') ||
      lowerText.includes('scan this channel') ||
      lowerText.includes('analyze current channel') ||
      lowerText.includes('analyze #')
    ) {
      const messages = await getRecentChannelMessages(75, 50);

      const realSlackInput = `
You are Atlas, an AI Organizational Intelligence Platform.

Analyze the following real Slack channel messages.

Important:
- Use only the messages provided below as evidence.
- If the messages are limited, say the analysis is preliminary.
- Do not invent people, metrics, or channels.
- Identify repeated questions, unresolved issues, workflow bottlenecks, documentation gaps, collaboration patterns, and operational risks.
- Produce an executive-style Atlas Organizational Health Report.

Real Slack Channel Messages:
${messages.length > 0 ? messages.join('\n') : 'No readable user messages found.'}
`;

      await runAndStream(realSlackInput);
      return;
    }

    if (
      lowerText.includes('map this channel') ||
      lowerText.includes('dependency map') ||
      lowerText.includes('org map') ||
      lowerText.includes('organizational map')
    ) {
      const messages = await getRecentChannelMessages(100, 60);

      const dependencyMapInput = `
You are Atlas, an AI Organizational Intelligence Platform.

Analyze the following real Slack channel messages and build an Organizational Dependency Map.

Important:
- Use only the messages provided below as evidence.
- If data is limited, say the map is preliminary.
- Identify people, topics, ownership areas, knowledge hubs, bottlenecks, and knowledge transfer opportunities.
- Do not invent names or facts not present in the messages.
- If Slack user IDs appear, refer to them exactly as provided.

Real Slack Channel Messages:
${messages.length > 0 ? messages.join('\n') : 'No readable user messages found.'}

Format:

Atlas Organizational Dependency Map

Scope:
Data Confidence:

Knowledge Hubs:
- Person/User:
  Ownership Areas:
  Evidence:

Operational Bottlenecks:
- Bottleneck:
  Dependency:
  Risk:

Topic Clusters:
- Topic:
  Related Users:
  Signal:

Recommended Knowledge Transfers:
1.
2.
3.

Atlas Insight:
`;

      await runAndStream(dependencyMapInput);
      return;
    }

    if (
      lowerText.includes('action plan') ||
      lowerText.includes('remediation plan') ||
      lowerText.includes('improvement plan') ||
      lowerText.includes('operational plan')
    ) {
      const messages = await getRecentChannelMessages(100, 60);

      const actionPlanInput = `
You are Atlas, an AI Organizational Intelligence Platform.

Analyze the Slack messages below and generate a practical 30-day operational improvement plan.

Important:
- Use only the evidence provided.
- Prioritize the most impactful risks.
- Focus on realistic actions leadership can take.
- Include expected outcomes.
- If data is limited, say the plan is preliminary.
- Do not invent names or facts not present in the messages.

Slack Messages:
${messages.length > 0 ? messages.join('\n') : 'No readable user messages found.'}

Format:

Atlas Operational Action Plan

Current Health Status:
Top Risk:
Primary Opportunity:

Week 1
Owner:
Actions:
Expected Outcome:

Week 2
Owner:
Actions:
Expected Outcome:

Week 3
Owner:
Actions:
Expected Outcome:

Week 4
Owner:
Actions:
Expected Outcome:

Expected Business Impact
- Time Saved:
- Risk Reduction:
- Operational Improvement:

Atlas Recommendation:
`;

      await runAndStream(actionPlanInput);
      return;
    }

    if (
      lowerText.includes('trends') ||
      lowerText.includes('trend analysis') ||
      lowerText.includes('risk trend') ||
      lowerText.includes('organizational trends')
    ) {
      const messages = await getRecentChannelMessages(100, 60);

      const trendInput = `
You are Atlas, an AI Organizational Intelligence Platform.

Analyze the Slack messages below and generate an organizational trend analysis.

Important:
- Use only the evidence provided.
- If there is limited historical data, frame trends as "early signals" rather than proven long-term trends.
- Identify whether risks appear stable, improving, or escalating.
- Focus on approval delays, documentation gaps, knowledge concentration, onboarding friction, and workflow blockers.
- Do not invent facts not present in the messages.

Slack Messages:
${messages.length > 0 ? messages.join('\n') : 'No readable user messages found.'}

Format:

Atlas Organizational Trend Analysis

Trend Window:
Data Confidence:
Risk Direction:

Key Trends:
1.
2.
3.

Leading Indicators:
- Approval Flow:
- Documentation Health:
- Knowledge Distribution:
- Onboarding Readiness:

Trend Interpretation:

Recommended Next Move:

Atlas Forecast:
`;

      await runAndStream(trendInput);
      return;
    }

    const history = conversationStore.getHistory(channelId, threadTs);
    /** @type {string | import('@openai/agents').AgentInputItem[]} */
    const inputItems = history ? [...history, { role: 'user', content: cleanedText }] : cleanedText;

    await runAndStream(inputItems);
  } catch (e) {
    logger.error(`Failed to handle app mention: ${e}`);
    await say({
      text: `:warning: Something went wrong! (${e})`,
      thread_ts: event.thread_ts || event.ts,
    });
  }
}