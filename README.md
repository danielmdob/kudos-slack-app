# Kudos Slack App

### Required environment variables:
- SLACK_BOT_TOKEN

### Slack bot token scopes:
- app_mentions:read
- chat:write

### To use:
- Deploy backend `sls deploy`
- Configure Slack App
  - Switch on event subscriptions, set url to deployed lambda
  - Add required bot token scopes
- Add app to workspace
- Include app in channel
- Tag app, user, and send a 'doughnut' emoji
- Receive a confirmation message
