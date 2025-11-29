import chalk from "chalk";
import { LogLevel } from "./enums/log-level";

export class Lugga {
  constructor(private context: string) {}

  public log(...args: any[]): void {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");

    this.formatMessage(message, LogLevel.LOG);
  }

  public debug(...args: any[]): void {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");

    this.formatMessage(message, LogLevel.DEBUG);
  }

  public info(...args: any[]): void {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");

    this.formatMessage(message, LogLevel.INFO);
  }

  public warn(...args: any[]): void {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");

    this.formatMessage(message, LogLevel.WARN);
  }
  public error(...args: any[]): void {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");

    this.formatMessage(message, LogLevel.ERROR);
  }

  private formatMessage(message: string, level: LogLevel): void {
    const time = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : "";
    const formattedMessage = `${time} ${level.toUpperCase()} ${ctx} ${message}`;

    console.log(this.colorize(level, formattedMessage));
  }

  private colorize(level: LogLevel, text: string) {
    switch (level) {
      case "log":
        return chalk.white(text);
      case "info":
        return chalk.blue(text);
      case "warn":
        return chalk.yellow(text);
      case "error":
        return chalk.red(text);
      case "debug":
        return chalk.cyan(text);
      default:
        return text;
    }
  }
}
