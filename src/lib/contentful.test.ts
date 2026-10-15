import { describe, expect, it } from "vitest";
import { parseEmbedUrl, buildSrcSet } from "./contentful";

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

describe("buildSrcSet", () => {
  it("generates responsive srcset for Contentful asset URLs", () => {
    const src = "https://images.ctfassets.net/space/asset/test.jpg?fm=webp&q=80&w=800";
    const srcSet = buildSrcSet(src);
    expect(srcSet).toContain("w=400 400w");
    expect(srcSet).toContain("w=800 800w");
    expect(srcSet).toContain("w=1200 1200w");
    expect(srcSet).toContain("w=1920 1920w");
  });

  it("returns undefined for empty, invalid, or non-Contentful URLs", () => {
    expect(buildSrcSet("")).toBeUndefined();
    expect(buildSrcSet(undefined)).toBeUndefined();
    expect(buildSrcSet("https://external-site.com/image.jpg")).toBeUndefined();
  });
});

