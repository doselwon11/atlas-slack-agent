/**
 * Build the App Home Block Kit view.
 * @param {string | null} [installUrl] - OAuth install URL shown when MCP is disconnected.
 * @param {boolean} [isConnected] - Whether the Slack MCP Server is connected.
 * @returns {import('@slack/types').HomeView}
 */
export function buildAppHomeView(installUrl = null, isConnected = false) {
  /** @type {import('@slack/types').KnownBlock[]} */
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Atlas — Organizational Intelligence',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '*Atlas helps teams detect hidden operational risks before they become business failures.*\n\n' +
          'Analyze Slack conversations, identify knowledge silos, surface workflow bottlenecks, and generate executive-ready organizational health reports.',
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: '*Organization Health*\n78/100',
        },
        {
          type: 'mrkdwn',
          text: '*Current Status*\nWatch',
        },
        {
          type: 'mrkdwn',
          text: '*Top Risk*\nKnowledge Concentration',
        },
        {
          type: 'mrkdwn',
          text: '*Top Opportunity*\nApproval Automation',
        },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Quick Commands*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '`@atlas analyze this channel`\n' +
          'Generate a real channel health report from recent Slack messages.\n\n' +
          '`@atlas risks`\n' +
          'Show the Atlas Risk Radar.\n\n' +
          '`@atlas executive summary`\n' +
          'Create a leadership-ready brief.\n\n' +
          '`@atlas scorecard`\n' +
          'Show an organizational health scorecard.\n\n' +
          '`@atlas map this channel`\n' +
          'Build an organizational dependency map from channel activity.\n\n' +
          '`@atlas action plan`\n' +
          'Generate a 30-day operational improvement plan from channel signals.',
      },
    },
    { type: 'divider' },
  ];

  if (isConnected) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '🟢 *Slack MCP Server is connected.* Atlas can use enhanced Slack context.',
      },
    });
  } else if (installUrl) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🔴 *Slack MCP Server is disconnected.* <${installUrl}|Connect the Slack MCP Server.>`,
      },
    });
  } else {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '🟡 *Real channel analysis is available through Slack bot history access.*\n' +
          'MCP connection is optional for this demo, but can unlock broader Slack search and workspace intelligence.',
      },
    });
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Built for the Slack Agent Builder Challenge.',
        },
      ],
    },
  );

  return { type: 'home', blocks };
}