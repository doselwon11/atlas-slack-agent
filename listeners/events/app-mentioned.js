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

    // Strip the bot mention from the text
    const cleanedText = text.replace(/<@[A-Z0-9]+>/g, '').trim();
    const lowerText = cleanedText.toLowerCase();

    if (!cleanedText) {
      await say({
        text: "Hey there! How can I help you? Ask me anything and I'll do my best.",
        thread_ts: threadTs,
      });
      return;
    }

    // Set assistant thread status with loading messages
    await setStatus({
      status: 'Analyzing workspace signals…',
      loading_messages: [
        'Reading recent channel activity…',
        'Looking for repeated questions…',
        'Detecting workflow bottlenecks…',
        'Mapping organizational risk signals…',
        'Preparing Atlas intelligence report…',
      ],
    });

    // Special path: real Slack channel analysis using bot token
    if (
      lowerText.includes('analyze this channel') ||
      lowerText.includes('scan this channel') ||
      lowerText.includes('analyze current channel') ||
      lowerText.includes('analyze #')
    ) {
      let messages = [];

      try {
        const historyResult = await client.conversations.history({
          channel: channelId,
          limit: 75,
        });

        messages = (historyResult.messages || [])
          .filter((m) => m.text && !m.bot_id)
          .slice(0, 50)
          .map((m, i) => {
            const user = m.user ? `<@${m.user}>` : 'unknown_user';
            const text = m.text.replace(/\s+/g, ' ').trim();
            return `${i + 1}. ${user}: ${text}`;
          });
      } catch (historyError) {
        logger.error(`Failed to read channel history: ${historyError}`);
      }

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

      const deps = new AgentDeps(client, userId, channelId, threadTs, event.ts, context.userToken);
      const result = await runAgent(realSlackInput, deps);

      const streamer = sayStream();
      await streamer.append({ markdown_text: result.finalOutput });
      const feedbackBlocks = buildFeedbackBlocks();
      await streamer.stop({ blocks: feedbackBlocks });

      conversationStore.setHistory(channelId, threadTs, result.history);
      return;
    }

    // Normal agent path
    const history = conversationStore.getHistory(channelId, threadTs);
    /** @type {string | import('@openai/agents').AgentInputItem[]} */
    const inputItems = history ? [...history, { role: 'user', content: cleanedText }] : cleanedText;

    const deps = new AgentDeps(client, userId, channelId, threadTs, event.ts, context.userToken);
    const result = await runAgent(inputItems, deps);

    const streamer = sayStream();
    await streamer.append({ markdown_text: result.finalOutput });
    const feedbackBlocks = buildFeedbackBlocks();
    await streamer.stop({ blocks: feedbackBlocks });

    conversationStore.setHistory(channelId, threadTs, result.history);
  } catch (e) {
    logger.error(`Failed to handle app mention: ${e}`);
    await say({
      text: `:warning: Something went wrong! (${e})`,
      thread_ts: event.thread_ts || event.ts,
    });
  }
}