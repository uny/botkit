declare namespace botkit {
  class Controller {
    events: any; // FIXME
    config: Configuration;
    tasks: Task[];
    taskCount: number;
    convoCount: number;
    my_version: string;
    my_user_agent: string;
    memory_store: {
    }
  }
  class Task {
  }
  interface Configuration {
  }
  export function slactbot(): void;
}

export = botkit;
