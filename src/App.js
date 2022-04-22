import { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
// import MonacoEditor from "@uiw/react-monacoeditor";

import "./styles.css";
const css = {
  page: {
    display: "grid",
    gap: `var(--size-8)`,
    accent: "magenta"
  },
  code: {
    boxShadow: "var(--shadow-3)",
    borderRadius: "var(--radius-2)",
    overflow: "hidden",
    verticalAlign: "top",
    display: "block"
  },
  splitEditor: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: `var(--size-5)`
  },
  button: {
    boxShadow: "var(--shadow-1)"
  },
  linkButton: {
    all: "unset",
    float: "right",
    cursor: "pointer"
  },
  stack: {
    display: "grid",
    gap: `var(--size-3)`
  },
  picture: {
    width: "auto",
    height: "auto",
    maxWidth: 500
  },
  previewIframe: {
    border: "1px solid var(--yellow-3)"
  },
  list: {
    display: `grid`,
    gap: `var(--size-1)`,
    padding: `0 var(--size-3)`
  },
  li: {
    paddingInlineStart: "var(--size-2)"
  },
  hero: {
    display: "grid",
    gap: `var(--size-5)`,
    gridTemplateColumns: "1fr 1fr",
    alignItems: "start"
  },
  fields: {
    checkbox: {
      display: "grid",
      gap: `var(--size-2)`,
      alignItems: "center",
      gridTemplateColumns: "min-content 1fr"
    }
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: `var(--size-3)`
  }
};

const CODE = {
  react: `import { useCallback, useRef } from "react";

function App() {
  const ref = useRef(null);
  const showModal = useCallback(() => {
    ref.current.showModal();
  }, [ref]);

  const closeModal = useCallback(() => {
    ref.current.close();
  }, [ref]);

  return (
    <>
      <button onClick={showModal}>Open modal</button>
      <dialog ref={ref}>
        <form method="dialog">
          <button onClick={closeModal}>OK</button>
        </form>
      </dialog>
    </>
  )
}`,
  html: `<dialog id="dialog">
  <form method="dialog">
    <p>Hi, I'm a dialog.</p>
    <button>OK</button>
  </form>
</dialog>

<button onclick="dialog.showModal()">Open Dialog</button>
`
};

const labels = {
  reset: "reset this code example"
};

function CodeExample({ src, language, showPreview }) {
  const [value, setValue] = useState(src);
  useEffect(() => {
    setValue(src);
  }, [setValue, src]);
  const reset = () => setValue(src);
  return (
    <div style={showPreview ? css.splitEditor : {}}>
      <div>
        <div style={css.code}>
          <CodeMirror
            value={value}
            extraKeys={{ Tab: false }}
            height="100%"
            theme={oneDark}
            extensions={[javascript({ jsx: true })]}
            onChange={setValue}
          />
        </div>

        <button onClick={reset} type="button" style={css.linkButton}>
          <span role="img" aria-label={labels.reset}>
            ⏪
          </span>{" "}
          {labels.reset}
        </button>
      </div>

      {showPreview && (
        <iframe
          title="live html code preview"
          style={css.previewIframe}
          width={300}
          height={300}
          srcDoc={value}
        />
      )}
    </div>
  );
}

export default function App() {
  const ref = useRef(null);
  const [codeId, setCodeId] = useState("html");
  const toggleCode = () => setCodeId(codeId === "html" ? "react" : "html");

  const showModal = useCallback(() => {
    ref.current.showModal();
  }, [ref]);

  const closeModal = useCallback(() => {
    ref.current.close();
  }, [ref]);

  return (
    <div style={css.page}>
      <header style={css.header}>
        <section>
          <h1 className="hero-message">
            The <code>{"<dialog />"}</code> element
          </h1>
        </section>
      </header>
      <main>
        <section style={css.hero}>
          <div style={css.stack}>
            <p className="under-hero">
              A modal dialog component has more complexity than one might
              suspect. The <code>{`<dialog>`}</code> HTMLElement provides so
              much native functionality and accessibility support for free and
              has{" "}
              <a
                href="https://caniuse.com/dialog"
                target="_blank"
                rel="noreferrer nofollow"
              >
                growing browser support
              </a>
              .
            </p>
            <div>
              <button onClick={showModal}>Open dialog</button>
            </div>

            <ul style={css.list}>
              {[
                "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog",
                "https://web.dev/building-a-dialog-component/#styles"
              ].map((url) => (
                <li key={url} style={css.li}>
                  <a href={url} target="_blank" rel="noreferrer nofollow">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
            <section>
              <h2>HTML</h2>
              <p>
                Note the <code>onclick</code> and the form <code>method</code>
              </p>
              <CodeExample src={CODE.html} showPreview />
            </section>
            <section>
              <h2>React</h2>
              <p>
                This is as simple as I could get it. React requires a function
                for <code>onClick</code>
              </p>
              <CodeExample src={CODE.react} />
            </section>
          </div>
          <picture style={css.picture}>
            <img
              src="https://doodleipsum.com/700x700/outline?bg=3b5bdb"
              height="800"
              width="800"
              alt="a random doodle"
            />
          </picture>
        </section>
      </main>

      <dialog ref={ref}>
        <form method="dialog">
          <header style={css.modalHeader}>
            <h3>{codeId[0]?.toUpperCase() + codeId.slice(1)} Code</h3>
            <button onClick={closeModal}>Close</button>
          </header>
          <p>
            Notice how it scrolls internally.
            <br />
            There is also no need to style or manage its stacking order.
          </p>
          <div style={css.fields?.checkbox}>
            <input type="checkbox" name="code" id="code" onClick={toggleCode} />
            <label htmlFor="code">
              show<code>{codeId === "html" ? "react" : "html"}</code>code
            </label>
          </div>

          <CodeExample src={CODE[codeId]} />
        </form>
      </dialog>

      <footer>
        [btw] this CSS library is awesome:{" "}
        <a
          href="https://open-props.style/"
          target="_blank"
          rel="noreferrer nofollow"
        >
          https://open-props.style/
        </a>
      </footer>
    </div>
  );
}
