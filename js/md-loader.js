export async function loadMarkdownContent() {

  const targets =
    document.querySelectorAll(
      "[data-md]"
    );

  for (const target of targets) {

    const file =
      target.dataset.md;

    if (!file) continue;

    try {

      const res =
        await fetch(
          `./content/${file}.md`
        );

      const text =
        await res.text();

      target.innerHTML =
        parseMarkdown(text);

    }

    catch (err) {

      console.error(
        "[markdown] load failed",
        file,
        err
      );

    }

  }

}

function parseMarkdown(md) {

  return md

    /* h1 */
    .replace(
      /^# (.*$)/gim,
      "<h1>$1</h1>"
    )

    /* h2 */
    .replace(
      /^## (.*$)/gim,
      "<h2>$1</h2>"
    )

    /* h3 */
    .replace(
      /^### (.*$)/gim,
      "<h3>$1</h3>"
    )

    /* bold */
    .replace(
      /\*\*(.*?)\*\*/gim,
      "<strong>$1</strong>"
    )

    /* list */
    .replace(
      /^\- (.*$)/gim,
      "<li>$1</li>"
    )

    /* wrap ul */
    .replace(
      /(<li>.*<\/li>)/gims,
      "<ul>$1</ul>"
    )

    /* line break */
    .replace(
      /\n\n/gim,
      "</p><p>"
    )

    /* wrap p */
    .replace(
      /^(?!<h|<ul|<li)(.+)$/gim,
      "<p>$1</p>"
    );

}