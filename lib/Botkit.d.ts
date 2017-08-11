declare namespace botkit {
  function consolebot(configuration: ConsoleConfiguration): ConsoleController;
  function facebookbot(configuration: FacebookConfiguration): FacebookController;
  function slackbot(configuration: SlackConfiguration): SlackController;
  function sparkbot(configuration: CiscoSparkConfiguration): CiscoSparkController;
  interface Bot<E, M extends Message> {
    readonly botkit: Controller<E, M, this>;
    readonly identity: Identity;
    readonly utterances: {
      yes: RegExp;
      no: RegExp;
      quit: RegExp;
    };
    createConversation(message: M, cb: (err: Error, convo: Conversation<M>) => void): void;
    reply(src: M, resp: string | M, cb?: (err: Error, res: any) => void): void;
    startConversation(message: M, cb: (err: Error, convo: Conversation<M>) => void): void;
  }
  interface Channel {
    id: any;
  }
  interface CiscoSparkBot extends Bot<CiscoSparkEventType, CiscoSparkMessage> {
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
    studio_token?: string;
    webhook_name?: string;
  }
  interface CiscoSparkController extends Controller<CiscoSparkEventType, CiscoSparkMessage, CiscoSparkBot> {
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
  interface ConsoleBot extends Bot<ConsoleEventType, ConsoleMessage> {
  }
  interface ConsoleConfiguration extends Configuration {
  }
  interface ConsoleController extends Controller<ConsoleEventType, ConsoleMessage, ConsoleBot> {
  }
  interface ConsoleMessage extends Message {
  }
  interface Controller<E, M extends Message, B extends Bot<E, M>> {
    readonly storage: {
      users: Storage<User>;
      channels: Storage<Channel>;
      teams: Storage<Team>;
    };
    readonly log: {
      (...params: any[]): void;
    }
    createWebhookEndpoints(webserver: any, authenticationTokens?: string[]): this;
    hears(keywords: string | string[] | RegExp | RegExp[], events: string | string[], cb: HearsCallback<E, M, B>): this;
    hears(keywords: string | string[] | RegExp | RegExp[], events: string | string[], middleware_or_cb: HearsFunction<M>, cb: HearsCallback<E, M, B>): this;
    on(event: E, cb: HearsCallback<E, M, B>): this;
    setupWebserver(port: number | string, cb: (err: Error, webserver: any) => void): this;
    spawn(config?: { token?: string; }, cb?: (worker: B) => void): B;
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
    on(event: string, cb: (convo: this) => void): void;
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
  interface FacebookAttachment {
    type: 'audio' | 'file' | 'image' | 'video';
    payload: any;
  }
  interface FacebookBot extends Bot<FacebookEventType, FacebookMessage> {
    replyWithTyping(src: FacebookMessage, resp: string | FacebookMessage, cb?: (err: Error) => void): void;
    startTyping(src: FacebookMessage, cb?: (err: Error) => void): void;
    stopTyping(src: FacebookMessage, cb?: (err: Error) => void): void;
  }
  interface FacebookConfiguration extends Configuration {
    access_token: string;
    app_secret?: string;
    receive_via_postback?: boolean;
    require_delivery?: boolean;
    validate_requests?: boolean;
    verify_token: string;
  }
  interface FacebookController extends Controller<FacebookEventType, FacebookMessage, FacebookBot> {
    readonly api: {
      attachment_upload: {
        upload(attachment: FacebookAttachment, cb: (err: Error, attachment_id: string) => void): void;
      };
      messenger_profile: any;
      thread_settings: any;
    };
  }
  interface FacebookMessage extends Message {
    attachment?: FacebookAttachment;
    notification_type: 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH';
    payload?: string;
    sender_action?: 'typing_on' | 'typing_off';
  }
  interface FacebookMessengerProfileAPI {
    account_linking(payload: string): void;
    delete_account_linking(): void;
    delete_domain_whitelist(): void;
    delete_get_started(): void;
    delete_greeting(): void;
    delete_home_url(): void;
    delete_menu(): void;
    delete_target_audience(): void;
    domain_whitelist(payload: string | string[]): void;
    get_account_linking(cb: (err: Error, body: any) => void): void;
    get_domain_whitelist(cb: (err: Error, body: any) => void): void;
    get_get_started(cb: (err: Error, body: any) => void): void;
    get_greeting(cb: (err: Error, body: any) => void): void;
    get_home_url(cb: (err: Error, body: any) => void): void;
    get_started(payload: string): void;
    get_menu(cb: (err: Error, body: any) => void): void;
    get_messenger_code(image_size: number, cb: (err: Error, uri: string) => void, ref?: string): void;
    get_target_audience(cb: (err: Error, body: any) => void): void;
    greeting(payload: string | { locale: string; text: string; }[]): void;
    home_url(payload: { url: string; webview_height_ratio: 'tall'; webview_share_button?: 'show' | 'hide'; in_test?: boolean; }): void;
    menu(payload: any): void;
    target_audience(payload: { audience_type: 'all' | 'custom' | 'none'; countries?: { blacklist?: string[]; whitelist?: string[]; }; }): void;
  }
  interface Identity {
    name: string;
    emails: string[];
  }
  interface Message {
    action?: string;
    channel?: string;
    match?: RegExpMatchArray;
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
  interface SlackBot extends Bot<SlackEventType, SlackMessage> {
    readonly api: SlackWebAPI;
    configureIncomingWebhook(config: { url: string; }): this;
    createConversationInThread(src: SlackMessage, cb: (err: Error, res: string) => void): void;
    createPrivateConversation(message: SlackMessage & { user: string; }, cb: (err: Error, convo: Conversation<SlackMessage>) => void): void;
    closeRTM(): void;
    destroy(): void;
    identifyTeam(): string;
    identifyBot(): { id: string; name: string; team_id: string; };
    replyAcknowledge(cb?: (err: Error) => void): void;
    replyAndUpdate(src: SlackMessage, resp: string | SlackMessage, cb: (err: Error, res: string) => void): void;
    replyInThread(src: SlackMessage, resp: string | SlackMessage, cb: (err: Error, res: string) => void): void;
    replyPrivate(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPrivateDelayed(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPublic(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyPublicDelayed(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
    replyInteractive(src: SlackMessage, resp: string | SlackMessage, cb?: (err: Error) => void): void;
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
    ts?: string;
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
  type ConversationCallback<M extends Message> = ((message: M, convo: Conversation<M>) => void) | ({ pattern?: string | RegExp; default?: boolean; callback: (message: M, convo: Conversation<M>) => void; }[]);
  type ConversationStatusType = 'completed' | 'active' | 'stopped' | 'timeout' | 'ending' | 'inactive';
  type FacebookEventType = 'facebook_account_linking' |
    'facebook_optin' |
    'facebook_postback' |
    'facebook_referral' |
    'message_delivered' |
    'message_read' |
    'message_received';
  type HearsCallback<E, M extends Message, B extends Bot<E, M>> = (bot: B, message: M) => void;
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

export default botkit;
