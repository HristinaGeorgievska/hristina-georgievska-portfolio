import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentfulPicture } from "./ContentfulPicture";

const SRC = "https://images.ctfassets.net/space/asset/test.jpg";

describe("ContentfulPicture", () => {
  it("renders AVIF then WebP sources with a JPG fallback", () => {
    const { container } = render(
      <ContentfulPicture
        src={SRC}
        alt="Gallery cover"
        sizes="33vw"
        width={800}
        height={1067}
      />
    );

    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("type", "image/avif");
    expect(sources[1]).toHaveAttribute("type", "image/webp");
    expect(sources[0].getAttribute("srcset")).toContain("fm=avif");
    expect(sources[1].getAttribute("srcset")).toContain("fm=webp");

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src");
    expect(img?.getAttribute("src")).toContain("fm=jpg");
    expect(img?.getAttribute("srcset")).toContain("fm=jpg");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "1067");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("requests thumbnail widths for grid images and larger widths for full view", () => {
    const { container: thumb } = render(
      <ContentfulPicture
        src={SRC}
        alt="Thumb"
        sizes="33vw"
        width={800}
        height={1067}
        preset="thumbnail"
      />
    );
    const { container: full } = render(
      <ContentfulPicture
        src={SRC}
        alt="Full"
        sizes="90vw"
        width={1600}
        height={2133}
        preset="full"
        loading="eager"
        fetchPriority="high"
      />
    );

    const thumbSrcSet = thumb.querySelector("source")?.getAttribute("srcset") ?? "";
    const fullSrcSet = full.querySelector("source")?.getAttribute("srcset") ?? "";
    expect(thumbSrcSet).toContain("w=640");
    expect(thumbSrcSet).not.toContain("w=2400");
    expect(fullSrcSet).toContain("w=2400");
    expect(full.querySelector("img")).toHaveAttribute("loading", "eager");
    expect(full.querySelector("img")).toHaveAttribute("fetchpriority", "high");
  });

  it("falls back to a plain img for non-Contentful URLs", () => {
    const { container } = render(
      <ContentfulPicture
        src="https://example.com/photo.jpg"
        alt="External"
        sizes="100vw"
        width={800}
        height={600}
      />
    );
    expect(container.querySelector("picture")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg"
    );
  });
});
