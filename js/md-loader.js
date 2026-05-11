export async function loadMarkdownContent() {
  const blocks =
    document.querySelectorAll("[data-md]");

  if (!blocks.length) return;

  blocks.forEach(async block => {
    const file = block.dataset.md;

    try {
      const res =
        await fetch(`./content/${file}.md`);

      if (!res.ok) {
        throw new Error("Markdown not found");
      }

      const text = await res.text();

      block.innerHTML = parseMarkdown(text);
    }
    catch (err) {
      block.innerHTML = `
        <article class="info-section">
          <small>Error</small>
          <h3>Content failed to load</h3>
          <p>Please try again later.</p>
        </article>
      `;
    }
  });
}

function parseMarkdown(md) {
  return md
    .split("\n\n")
    .map(block => parseBlock(block.trim()))
    .join("");
}

function parseBlock(block) {
  if (!block) return "";

  if (block.startsWith("### ")) {
    return `<article class="info-section"><h3>${block.replace("### ", "")}</h3></article>`;
  }

  if (block.startsWith("## ")) {
    return `<article class="info-section"><small>${block.replace("## ", "")}</small>`;
  }

  if (block.startsWith("# ")) {
    return `
      <article class="info-section">
        <small>HeriLand</small>
        <h3>${block.replace("# ", "")}</h3>
      </article>
    `;
  }

  if (block.startsWith("- ")) {
    const items = block
      .split("\n")
      .map(line => line.replace("- ", ""))
      .map(item => `<li>${inlineMarkdown(item)}</li>`)
      .join("");

    return `
      <article class="info-section">
        <ul class="info-list">
          ${items}
        </ul>
      </article>
    `;
  }

  return `
    <article class="info-section">
      <p>${inlineMarkdown(block).replace(/\n/g, "<br>")}</p>
    </article>
  `;
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}