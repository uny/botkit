declare namespace botkit {
  function consolebot(configuration: ConsoleConfiguration): ConsoleController;
  function slackbot(configuration: SlackConfiguration): SlackController;
  function sparkbot(configuration: CiscoSparkConfiguration): CiscoSparkController;
  // function facebookbot(configuration: Configuration): Controller;
  // function twilioipmbot(configuration: Configuration): Controller;
  // function twiliosmsbot(configuration: Configuration): Controller;
  // function botframeworkbot(configuration: Configuration): Controller;
  interface Bot<M extends Message> {
    createConversation(message: M, cb: (err: Error, convo: Conversation<M>) => void): void;
    reply(src: M, resp: string | M, cb?: (err: Error, res: any) => void): void;
    startConversation(message: M, cb: (err: Error, convo: Conversation<M>) => void): void;
  }
  interface Channel {
    id: any;
  }
  interface CiscoSparkBot extends Bot<CiscoSparkMessage> {
    retrieveFile(url: string, cb: (err: Error, body: any) => void): void;
    retrieveFileInfo(url: string, cb: (err: Error, obj: any) => void): void;
    startPrivateConversation(message: CiscoSparkMessage, cb: (err: Error, convo: Conversation<CiscoSparkMessage>) => void): void;
    startPrivateConversationWithActor(message: CiscoSparkMessage, cb: (err: Error, convo: Conversation<CiscoSparkMessage>) => void): void;
    startPrivateConversationWithPersonId(personId: string, cb: (err: Error, convo: Conversation<CiscoSparkMessage>) => void): void;
  }
  interface CiscoSparkConfiguration extends Configuration {
    ciscospark_access_token: string;
    limit_to_domain?: string | string[];
    limit_to_org?: string;
    public_address: string;
    secret?: string;
    webhook_name?: string;
  }
  interface CiscoSparkController extends Controller<CiscoSparkEventType, CiscoSparkMessage, CiscoSparkBot> {
    spawn(config: {}, cb?: (worker: CiscoSparkBot) => void): CiscoSparkBot;
  }
  interface CiscoSparkMessage extends Message {
    actorId?: string;
    files?: any[];
    markdown?: string;
    original_message?: CiscoSparkMessage;
  }
  interface Configuration {
    debug?: boolean;
    hostname?: string;
    json_file_store?: string;
    log?: boolean;
    logger?: { log: Function; };
    storage?: {
      users: Storage<User>;
      channels: Storage<Channel>;
      teams: Storage<Team>;
    };
  }
  interface ConsoleBot extends Bot<ConsoleMessage> {
  }
  interface ConsoleConfiguration extends Configuration {
  }
  interface ConsoleController extends Controller<ConsoleEventType, ConsoleMessage, ConsoleBot> {
    spawn(config?: {}, cb?: (worker: ConsoleBot) => void): ConsoleBot;
  }
  interface ConsoleMessage extends Message {
  }
  interface Controller<E, M extends Message, B extends Bot<M>> {
    readonly storage: {
      users: Storage<User>;
      channels: Storage<Channel>;
      teams: Storage<Team>;
    };
    createWebhookEndpoints(webserver: any, authenticationTokens?: string[]): this;
    hears(keywords: string | string[] | RegExp | RegExp[], events: string | string[], middleware_or_cb: HearsFunction<M> | HearsCallback<M, B>, cb?: HearsCallback<M, B>): this;
    on(event: E, cb: HearsCallback<M, B>): this;
    setupWebserver(port: number | string, cb: (err: Error, webserver: any) => void): this;
    startTicking(): void;
  }
  interface Conversation<M extends Message> {
    readonly status: ConversationStatusType;
    activate(): void;
    addMessage(message: string | M, thread: string): void;
    addQuestion(message: string | M, cb: ConversationCallback<M>, capture_options: ConversationCaptureOptions, thread: string): void;
    ask(message: string | M, cb: ConversationCallback<M>, capture_options?: ConversationCaptureOptions): void;
    beforeThread(thread: string, callback: (convo: this, next: (err: string | Error) => void) => void): void;
    extractResponse(key: string): string;
    extractResponses(): { [key: string]: string };
    gotoThread(thread: string): void;
    next(): void;
    onTimeout(handler: (convo: this) => void): void;
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
    action?: string;
    channel?: string;
    text?: string;
    user?: string;
  }
  interface SlackAttachment {
    author_icon?: string;
    author_link?: string;
    author_name?: string;
    color?: string;
    fallback?: string;
    fields?: {
      title: string;
      value: string;
      short: boolean;
    }[];
    footer?: string;
    footer_icon?: string;
    image_url?: string;
    pretext?: string;
    text?: string;
    thumb_url?: string;
    title?: string;
    title_link?: string;
    ts?: string;
  }
  interface SlackBot extends Bot<SlackMessage> {
    readonly api: SlackWebAPI;
    configureIncomingWebhook(config: { url: string; }): this;
    createConversationInThread(src: SlackMessage, cb: (err: Error, res: string) => void): void;
    createPrivateConversation(message: SlackMessage & { user: string; }, cb: (err: Error, convo: Conversation<SlackMessage>) => void): void;
    closeRTM(): void;
    destroy(): void;
    identifyTeam();
    identifyBot();
    replyAcknowledge(cb?: (err: Error) => void): void;
    replyAndUpdate(src: SlackMessage, resp: string | SlackMessage, cb: (err: Error, res: string) => void): void;
    replyInThread(src: SlackMessage, resp: string | SlackMessage, cb: (err: Error, res: string) => void): void;
    replyPrivate(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPrivateDelayed(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPublic(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPublicDelayed(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyInteractive(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    say();
    sendWebhook(options: SlackMessage, cb: (err: string, body: any) => void): void;
    startPrivateConversation(message: SlackMessage & { user: string; }, cb: (err: Error, convo: Conversation<SlackMessage>) => void): void;
    startConversationInThread(src: SlackMessage, cb: (err: Error, res: string) => void): void;
    startRTM(cb?: (err: string, bot: SlackBot, payload: any) => void): SlackBot;
  }
  interface SlackConfiguration extends Configuration {
    api_root?: string;
    clientId?: string;
    clientSecret?: string;
    disable_startup_messages?: boolean;
    incoming_webhook?: { url: string; };
    interactive_replies?: boolean;
    rtm_receive_messages?: boolean;
    require_delivery?: boolean;
    retry?: number;
    scopes?: string[];
    send_via_rtm?: boolean;
    stale_connection_timeout?: number;
  }
  interface SlackController extends Controller<SlackEventType, SlackMessage, SlackBot> {
    configureSlackApp(config: { clientId: string; clientSecret: string; redirectUri: string; scopes: string[]; }): this;
    createHomepageEndpoint(webserver: any): this;
    createOauthEndpoints(webserver: any, callback: (err: Error, req: any, res: any) => void): this;
    setupWebserver();
    getAuthorizeURL(team_id: string, redirect_params: any): string;
    spawn(config: { token: string }, cb?: (worker: SlackBot) => void): SlackBot;
  }
  interface SlackMessage extends Message {
    attachments?: SlackAttachment[];
    icon_emoji?: string;
    icon_url?: string;
    link_names?: boolean;
    parse?: string;
    reply_broadcast?: boolean;
    type?: string;
    thread_ts?: string;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
    username?: string;
  }
  interface SlackWebAPI {
    auth: {
        test: SlackWebAPIMethod;
    },
    oauth: {
        access: SlackWebAPIMethod;
    }
    channels: {
        archive: SlackWebAPIMethod;
        create: SlackWebAPIMethod;
        history: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        invite: SlackWebAPIMethod;
        join: SlackWebAPIMethod;
        kick: SlackWebAPIMethod;
        leave: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        mark: SlackWebAPIMethod;
        rename: SlackWebAPIMethod;
        replies: SlackWebAPIMethod;
        setPurpose: SlackWebAPIMethod;
        setTopic: SlackWebAPIMethod;
        unarchive: SlackWebAPIMethod;
    };
    chat: {
        delete: SlackWebAPIMethod;
        postMessage: SlackWebAPIMethod;
        update: SlackWebAPIMethod;
        unfurl: SlackWebAPIMethod;
    };
    dnd: {
        endDnd: SlackWebAPIMethod;
        endSnooze: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        setSnooze: SlackWebAPIMethod;
        teamInfo: SlackWebAPIMethod;
    };
    emoji: {
        list: SlackWebAPIMethod;
    };
    files: {
        delete: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        upload: SlackWebAPIMethod;
    };
    groups: {
        archive: SlackWebAPIMethod;
        close: SlackWebAPIMethod;
        create: SlackWebAPIMethod;
        createChild: SlackWebAPIMethod;
        history: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        invite: SlackWebAPIMethod;
        kick: SlackWebAPIMethod;
        leave: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        mark: SlackWebAPIMethod;
        open: SlackWebAPIMethod;
        rename: SlackWebAPIMethod;
        replies: SlackWebAPIMethod;
        setPurpose: SlackWebAPIMethod;
        setTopic: SlackWebAPIMethod;
        unarchive: SlackWebAPIMethod;
    };
    im: {
        close: SlackWebAPIMethod;
        history: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        mark: SlackWebAPIMethod;
        open: SlackWebAPIMethod;
        replies: SlackWebAPIMethod;
    };
    mpim: {
        close: SlackWebAPIMethod;
        history: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        mark: SlackWebAPIMethod;
        open: SlackWebAPIMethod;
        replies: SlackWebAPIMethod;
    };
    pins: {
        add: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        remove: SlackWebAPIMethod;
    };
    reactions: {
        add: SlackWebAPIMethod;
        get: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        remove: SlackWebAPIMethod;
    };
    reminders: {
      add: SlackWebAPIMethod;
      complete: SlackWebAPIMethod;
      delete: SlackWebAPIMethod;
      info: SlackWebAPIMethod;
      list: SlackWebAPIMethod;
    };
    rtm: {
        start: SlackWebAPIMethod;
        connect: SlackWebAPIMethod;
    };
    search: {
        all: SlackWebAPIMethod;
        files: SlackWebAPIMethod;
        messages: SlackWebAPIMethod;
    };
    stars: {
        add: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        remove: SlackWebAPIMethod;
    };
    team: {
        accessLogs: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        billableInfo: SlackWebAPIMethod;
        integrationLogs: SlackWebAPIMethod;
        profile: {
          get: SlackWebAPIMethod;
        };
    };
    users: {
        getPresence: SlackWebAPIMethod;
        info: SlackWebAPIMethod;
        list: SlackWebAPIMethod;
        setActive: SlackWebAPIMethod;
        setPresence: SlackWebAPIMethod;
        deletePhoto: SlackWebAPIMethod;
        identity: SlackWebAPIMethod;
        setPhoto: SlackWebAPIMethod;
        profile: {
          get: SlackWebAPIMethod;
          set: SlackWebAPIMethod;
        };
    };
  }
  interface Storage<O> {
    save: (data: O, cb?: (err: Error, id: any) => void) => void;
    get: (id: any, cb: (err: Error, data: O) => void) => void;
    delete?: (id: any, cb?: (err: Error) => void) => void;
    all?: (cb: (err: Error, data: O[]) => void) => void;
  }
  interface Team {
    id: any;
  }
  interface User {
    id: any;
    name?: string;
  }
  type CiscoSparkEventType = 'bot_space_join' |
    'bot_space_leave' |
    'direct_mention' |
    'direct_message' |
    'message_received' |
    'self_message' |
    'user_space_leave' |
    'user_space_join';
  type ConsoleEventType = 'message_received';
  type ConversationCallback<M extends Message> = (message: M, convo: Conversation<M>) => void | { pattern: string | RegExp, callback: (message: M, convo: Conversation<M>) => void }[];
  type ConversationStatusType = 'completed' | 'active' | 'stopped' | 'timeout' | 'ending' | 'inactive';
  type HearsCallback<M extends Message, B extends Bot<M>> = (bot: B, message: M) => void;
  type HearsFunction<M extends Message> = (tests: string | string[] | RegExp | RegExp[], message: M) => boolean;
  type SlackEventType = 'ambient' |
    'bot_channel_join' |
    'bot_group_join' |
    'create_bot' |
    'create_incoming_webhook' |
    'create_team' |
    'create_user' |
    'direct_mention' |
    'direct_message' |
    'mention' |
    'message_received' |
    'oauth_error' |
    'outgoing_webhook' |
    'rtm_close' |
    'rtm_open' |
    'rtm_reconnect_failed' |
    'slash_command' |
    'update_team' |
    'update_user' |
    'user_channel_join' |
    'user_group_join';
  type SlackWebAPIMethod = (data: any, cb: (err: Error, response: any) => void) => void;
}

export = botkit;
