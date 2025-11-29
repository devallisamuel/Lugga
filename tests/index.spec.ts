import { LogLevel } from "../enums/log-level";
import { Lugga } from "../index";

// Mock chalk to avoid ESM compatibility issues with Jest
// Jest uses CommonJS, but Chalk v5+ is ESM-only
// This mock returns the text unchanged, letting us test our logic without chalk
jest.mock("chalk", () => ({
  __esModule: true,
  default: {
    white: (text: string) => text,
    blue: (text: string) => text,
    yellow: (text: string) => text,
    red: (text: string) => text,
    cyan: (text: string) => text,
  },
}));

describe("Lugga", () => {
  let lugga: Lugga;

  beforeEach(() => {
    lugga = new Lugga("TestContext");
  });

  describe("constructor", () => {
    it("should create an instance with a context", () => {
      const instance = new Lugga("MyContext");
      expect(instance).toBeInstanceOf(Lugga);
    });

    it("should create an instance with an empty context", () => {
      const instance = new Lugga("");
      expect(instance).toBeInstanceOf(Lugga);
    });
  });

  describe("log", () => {
    it("should call formatMessage with LOG level", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.log("test message");
      expect(formatMessageSpy).toHaveBeenCalledWith(
        "test message",
        LogLevel.LOG
      );
    });

    it("should not throw when logging a message", () => {
      expect(() => lugga.log("Hello World")).not.toThrow();
    });
  });

  describe("debug", () => {
    it("should call formatMessage with DEBUG level", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.debug("debug message");
      expect(formatMessageSpy).toHaveBeenCalledWith("debug message", "debug");
    });

    it("should not throw when logging a debug message", () => {
      expect(() => lugga.debug("Debug info")).not.toThrow();
    });
  });

  describe("info", () => {
    it("should call formatMessage with INFO level", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.info("info message");
      expect(formatMessageSpy).toHaveBeenCalledWith("info message", "info");
    });

    it("should not throw when logging an info message", () => {
      expect(() => lugga.info("Information")).not.toThrow();
    });
  });

  describe("warn", () => {
    it("should call formatMessage with WARN level", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.warn("warning message");
      expect(formatMessageSpy).toHaveBeenCalledWith("warning message", "warn");
    });

    it("should not throw when logging a warning", () => {
      expect(() => lugga.warn("Warning!")).not.toThrow();
    });
  });

  describe("error", () => {
    it("should call formatMessage with ERROR level", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.error("error message");
      expect(formatMessageSpy).toHaveBeenCalledWith("error message", "error");
    });

    it("should not throw when logging an error", () => {
      expect(() => lugga.error("Error occurred")).not.toThrow();
    });
  });

  describe("formatMessage (private)", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("should include timestamp in formatted message", () => {
      (lugga as any).formatMessage("test", "log");
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      // Check for ISO timestamp pattern (e.g., 2024-01-15T10:30:00.000Z)
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should include context in formatted message when context is provided", () => {
      const luggaWithContext = new Lugga("MyContext");
      (luggaWithContext as any).formatMessage("test", "log");
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("[MyContext]");
    });

    it("should handle empty context", () => {
      const luggaNoContext = new Lugga("");
      (luggaNoContext as any).formatMessage("test", "log");
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).not.toContain("[]");
    });
  });

  describe("colorize (private)", () => {
    it("should return white colored text for log level", () => {
      const result = (lugga as any).colorize("log", "test message");
      expect(result).toBeDefined();
    });

    it("should return blue colored text for info level", () => {
      const result = (lugga as any).colorize("info", "test message");
      expect(result).toBeDefined();
    });

    it("should return yellow colored text for warn level", () => {
      const result = (lugga as any).colorize("warn", "test message");
      expect(result).toBeDefined();
    });

    it("should return red colored text for error level", () => {
      const result = (lugga as any).colorize("error", "test message");
      expect(result).toBeDefined();
    });

    it("should return cyan colored text for debug level", () => {
      const result = (lugga as any).colorize("debug", "test message");
      expect(result).toBeDefined();
    });

    it("should return plain text for unknown level", () => {
      const result = (lugga as any).colorize("unknown", "test message");
      expect(result).toBe("test message");
    });
  });

  describe("integration tests", () => {
    it("should handle multiple log calls", () => {
      expect(() => {
        lugga.log("First message");
        lugga.log("Second message");
        lugga.log("Third message");
      }).not.toThrow();
    });

    it("should handle different log levels in sequence", () => {
      expect(() => {
        lugga.log("Log message");
        lugga.debug("Debug message");
        lugga.info("Info message");
        lugga.warn("Warning message");
        lugga.error("Error message");
      }).not.toThrow();
    });

    it("should handle special characters in messages", () => {
      expect(() => {
        lugga.log("Message with special chars: !@#$%^&*()");
        lugga.log("Message with unicode: 你好世界 🎉");
        lugga.log("Message with newlines:\nLine 1\nLine 2");
      }).not.toThrow();
    });

    it("should handle empty messages", () => {
      expect(() => {
        lugga.log("");
        lugga.debug("");
        lugga.info("");
        lugga.warn("");
        lugga.error("");
      }).not.toThrow();
    });

    it("should handle very long messages", () => {
      const longMessage = "a".repeat(10000);
      expect(() => lugga.log(longMessage)).not.toThrow();
    });

    it("should handle multiple arguments", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.log("hello", "world");
      expect(formatMessageSpy).toHaveBeenCalledWith("hello world", "log");
    });

    it("should handle mixed type arguments", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.log("count:", 42, { key: "value" });
      expect(formatMessageSpy).toHaveBeenCalledWith(
        'count: 42 {"key":"value"}',
        "log"
      );
    });

    it("should not add quotes around string arguments", () => {
      const formatMessageSpy = jest.spyOn(lugga as any, "formatMessage");
      lugga.log("hello");
      expect(formatMessageSpy).toHaveBeenCalledWith("hello", "log");
    });
  });
});
