declare namespace botkit {
  interface Conversation<M extends Message> {
    readonly status: ConversationStatusType;

    activate(): void;
    addMessage(message: string | M, thread: string): void;
    addQuestion(message: string | M, cb: ConversationCallback<M>, capture_options: ConversationCaptureOptions, thread: string): void;
    ask(message: string | M, cb: ConversationCallback<M>, capture_options?: ConversationCaptureOptions): void;
    beforeThread(thread: string, callback: (convo: Conversation<M>, next: (err: Error) => void) => void): void;
    extractResponse(key: string): string;
    extractResponses(): { [key: string]: string };
    gotoThread(thread: string): void;
    next(): void;
    onTimeout(handler: (convo: Conversation<M>) => void): void;
    repeat(): void;
    say(message: string | M): void;
    sayFirst(message: string | M): void;
    setTimeout(timeout: number): void;
    setVar(field: string, value: any): void;
    silentRepeat(): void;
    stop(status?: ConversationStatusType): void;
    transitionTo(thread: string, message: string | M): void;
  }
  interface ConversationCaptureOptions {
    key?: string;
    multiple?: boolean;
  }
  interface Message {
    text: string;
    action?: string;
  }
  interface SlackBot {
    readonly api: SlackWebAPI;

    say();
    reply();
    startConversation();
    startPrivateConversation(); // Slack only
    createConversation();
    createPrivateConversation();
    startRTM(cb: (err: Error, bot: SlackBot, payload: any) => void): SlackBot;
    closeRTM(): void;
    destroy(): void;
    replyInThread();
    startConversationInThread();
    createConversationInThread();
    configureIncomingWebhook();
    sendWebhook();
    replyAcknowledge();
    replyPublic();
    replyPrivate();
    replyPublicDelayed();
    replyPrivateDelayed();
    replyAndUpdate();
    identifyTeam();
    identifyBot();
    replyInteractive();
  }
  interface SlackConfiguration {
    clientId?: string;
    clientSecret?: string;
    scopes?: string[];
    debug?: boolean;
    stale_connection_timeout?: number;
    send_via_rtm?: boolean;
    retry?: number;
    api_root?: string;
    disable_startup_messages?: boolean;
    require_delivery?: boolean;
    incoming_webhook?: { url: string; };
    interactive_replies?: boolean;
    rtm_receive_messages?: boolean;
  }
  interface SlackController {
    on(event: SlackEventType, cb: any): void;
    hears(keywords: string | string[] | RegExp | RegExp[], events: string[], middleware_or_cb: any, cb: any);
    spawn(config: { token: string }): SlackBot;
    setupWebserver();
    createWebhookEndpoints();
    configureSlackApp();
    createOauthEndpoints();
    getAuthorizeURL();
    createHomepageEndpoint();
    createOauthEndpoints();
    createWebhookEndpoints();
    configureSlackApp();
  }
  interface SlackWebAPI {
  }
  type ConversationCallback<M extends Message> = (message: M, convo: Conversation<M>) => void | { pattern: string | RegExp, callback: (message: M, convo: Conversation<M>) => void }[];
  type ConversationStatusType = 'completed' | 'active' | 'stopped' | 'timeout' | 'ending' | 'inactive';
  type SlackEventType = 'message_received' |
    'bot_channel_join' |
    'user_channel_join' |
    'bot_group_join' |
    'user_group_join' |
    'direct_message' |
    'direct_mention' |
    'mention' |
    'ambient' |
    'rtm_open' |
    'rtm_close' |
    'rtm_reconnect_failed'; // FIXME: slack button

  function slackbot(configuration: SlackConfiguration): SlackController;
  // function sparkbot(configuration: Configuration): Controller;
  // function facebookbot(configuration: Configuration): Controller;
  // function twilioipmbot(configuration: Configuration): Controller;
  // function twiliosmsbot(configuration: Configuration): Controller;
  // function botframeworkbot(configuration: Configuration): Controller;
  // function consolebot(configuration: Configuration): Controller;
}

export = botkit;
