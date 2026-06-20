import { describe, expect, it } from "vitest";
import { parseEmbedUrl } from "./contentful";

describe("parseEmbedUrl", () => {
  it("normalizes YouTube and Vimeo URLs to allowed embed origins", () => {
    expect(parseEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
    expect(parseEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789"
    );
  });

  it("rejects unsupported iframe providers instead of passing them through", () => {
    expect(parseEmbedUrl("https://example.com/embed/tracker")).toBeUndefined();
    expect(parseEmbedUrl("javascript:alert(1)")).toBeUndefined();
  });
});
