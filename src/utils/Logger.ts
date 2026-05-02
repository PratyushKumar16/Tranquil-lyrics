type LoggerMessage =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;
type ProcessedLoggerMessage = Array<string | number | boolean | null | undefined>;

const Logger = {
  log: (messages: LoggerMessage) => {
    const processedMessages: ProcessedLoggerMessage =
      typeof messages === "object" ? messages : [messages];

    Spicetify?.showNotification(`Tranquil Logger: ${processedMessages.join(" ")}`, false, 5000);
    console.log(`Tranquil Logger: ${processedMessages.join(" ")}`);
  },
  warn: (messages: LoggerMessage) => {
    const processedMessages: ProcessedLoggerMessage =
      typeof messages === "object" ? messages : [messages];

    Spicetify?.showNotification(`Tranquil Logger: ${processedMessages.join(" ")}`, true, 5000);
    console.warn(`Tranquil Logger: ${processedMessages.join(" ")}`);
  },
  error: (messages: LoggerMessage) => {
    const processedMessages: ProcessedLoggerMessage =
      typeof messages === "object" ? messages : [messages];

    Spicetify?.showNotification(`Tranquil Logger: ${processedMessages.join(" ")}`, true, 5000);
    console.error(`Tranquil Logger: ${processedMessages.join(" ")}`);
  },
};

export default Logger;
