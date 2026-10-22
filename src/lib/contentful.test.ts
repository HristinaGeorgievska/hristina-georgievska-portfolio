import { describe, expect, it } from "vitest";
import {
  parseEmbedUrl,
  buildImageUrl,
  buildSrcSet,
  buildLqipUrl,
  getFallbackImageFormat,
  CONTENTFUL_IMAGE_WIDTHS,
  THUMBNAIL_IMAGE_WIDTHS,
  FULL_IMAGE_WIDTHS,
} from "./contentful";

const ASSET =
  "https://images.ctfassets.net/space/asset/test.jpg?fm=webp&q=80&w=800";

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

describe("buildImageUrl", () => {
  it("builds AVIF, WebP, and JPG URLs with quality and width", () => {
    expect(buildImageUrl(ASSET, { fm: "avif", q: 75, w: 1024 })).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=avif&q=75&w=1024"
    );
    expect(buildImageUrl(ASSET, { fm: "webp", q: 75, w: 640 })).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=webp&q=75&w=640"
    );
    expect(buildImageUrl(ASSET, { fm: "jpg", q: 80, w: 1600 })).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=jpg&q=80&w=1600"
    );
  });

  it("defaults quality to 75 for AVIF/WebP and 80 for JPG", () => {
    expect(buildImageUrl(ASSET, { fm: "avif", w: 640 })).toContain("q=75");
    expect(buildImageUrl(ASSET, { fm: "webp", w: 640 })).toContain("q=75");
    expect(buildImageUrl(ASSET, { fm: "jpg", w: 640 })).toContain("q=80");
  });

  it("normalizes protocol-relative URLs and Images API host", () => {
    expect(
      buildImageUrl("//images.ctfassets.net/space/asset/test.jpg", {
        fm: "webp",
        w: 640,
      })
    ).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=webp&q=75&w=640"
    );
    expect(
      buildImageUrl("https://assets.ctfassets.net/space/asset/test.jpg", {
        fm: "avif",
        w: 1024,
      })
    ).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=avif&q=75&w=1024"
    );
  });

  it("returns undefined for empty, invalid, or non-Contentful URLs", () => {
    expect(buildImageUrl("", { fm: "jpg" })).toBeUndefined();
    expect(buildImageUrl(undefined, { fm: "jpg" })).toBeUndefined();
    expect(
      buildImageUrl("https://external-site.com/image.jpg", { fm: "jpg" })
    ).toBeUndefined();
  });
});

describe("buildSrcSet", () => {
  it("generates responsive srcset for a requested format and widths", () => {
    const srcSet = buildSrcSet(ASSET, {
      fm: "avif",
      widths: CONTENTFUL_IMAGE_WIDTHS,
    });
    expect(srcSet).toContain("fm=avif&q=75&w=640 640w");
    expect(srcSet).toContain("fm=avif&q=75&w=1024 1024w");
    expect(srcSet).toContain("fm=avif&q=75&w=1600 1600w");
    expect(srcSet).toContain("fm=avif&q=75&w=2400 2400w");
    expect(srcSet).not.toContain("w=800 800w");
  });

  it("uses smaller widths for thumbnails and larger widths for full view", () => {
    const thumbs = buildSrcSet(ASSET, {
      fm: "webp",
      widths: THUMBNAIL_IMAGE_WIDTHS,
    });
    const full = buildSrcSet(ASSET, { fm: "webp", widths: FULL_IMAGE_WIDTHS });
    expect(thumbs).toContain("w=400 400w");
    expect(thumbs).toContain("w=640 640w");
    expect(thumbs).not.toContain("w=2400 2400w");
    expect(full).toContain("w=2400 2400w");
    expect(full).not.toContain("w=400 400w");
    expect(full).not.toContain("w=640 640w");
  });

  it("returns undefined for empty, invalid, or non-Contentful URLs", () => {
    expect(buildSrcSet("", { fm: "jpg" })).toBeUndefined();
    expect(buildSrcSet(undefined, { fm: "jpg" })).toBeUndefined();
    expect(
      buildSrcSet("https://external-site.com/image.jpg", { fm: "jpg" })
    ).toBeUndefined();
  });
});

describe("getFallbackImageFormat", () => {
  it("keeps PNG assets as PNG so alpha is not flattened to JPEG", () => {
    expect(
      getFallbackImageFormat(
        "https://images.ctfassets.net/space/asset/logo.png",
        "image/png"
      )
    ).toBe("png");
    expect(
      getFallbackImageFormat("https://images.ctfassets.net/space/asset/logo.png")
    ).toBe("png");
  });

  it("uses JPEG for photographic assets", () => {
    expect(getFallbackImageFormat(ASSET, "image/jpeg")).toBe("jpg");
    expect(getFallbackImageFormat(ASSET)).toBe("jpg");
  });
});

describe("buildLqipUrl", () => {
  it("generates a clean 20px low-quality placeholder", () => {
    expect(buildLqipUrl(ASSET)).toBe(
      "https://images.ctfassets.net/space/asset/test.jpg?fm=webp&q=20&w=20"
    );
  });

  it("returns undefined for non-Contentful or missing URLs", () => {
    expect(buildLqipUrl("")).toBeUndefined();
    expect(buildLqipUrl(undefined)).toBeUndefined();
    expect(buildLqipUrl("https://example.com/photo.jpg")).toBeUndefined();
  });
});
