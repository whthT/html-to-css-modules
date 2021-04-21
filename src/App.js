import { useEffect, useRef, useState } from "react";
import HTMLtoJSX from "htmltojsx";
import css from "./App.module.scss";
function App() {
  const outputClassNameEl = useRef(null);
  const [createClass, setCreateClass] = useState(window.localStorage.getItem('createClass') === "false" ? false : true);
  const [outputClassName, setOutputClassName] = useState(window.localStorage.getItem('outputClassName') || "AwesomeComponent");
  const [helperPattern, setHelperPattern] = useState(window.localStorage.getItem('helperPattern') || "css($)");
  useEffect(() => {
    if (createClass) {
      outputClassNameEl.current.focus();
    }
  }, [createClass]);

  useEffect(() => {
    window.localStorage.setItem('createClass', createClass)
  }, [createClass])

  useEffect(() => {
    window.localStorage.setItem('outputClassName', outputClassName)
  }, [outputClassName])

  useEffect(() => {
    window.localStorage.setItem('helperPattern', helperPattern)
  }, [helperPattern])

  const [liveCode, setLiveCode] = useState(`
  <!-- Hello world -->
  <div class="awesome" style="border: 1px solid red">
    <label for="name">Enter your name: </label>
    <input type="text" id="name" />
  </div>
  <p>Enter your HTML here</p>
  `);

  const [compiledCode, setCompiledCode] = useState("");

  useEffect(() => {
    if (window.__timeout !== null) {
      clearTimeout(window.__timeout);
    }

    window.__timeout = setTimeout(() => {
      var converter = new HTMLtoJSX({
        createClass,
        outputClassName,
      });
      var output = converter.convert(liveCode);
      setCompiledCode(
        output.replace(
          /className\=\"(.*?)\"/gm,
          `className={${helperPattern.replace("$", "'$1'")}}`
        )
      );
    }, liveCode.length > 2000 ? 1000 : 200);
  }, [liveCode, createClass, outputClassName, helperPattern]);
  return (
    <div className={css.App}>
      <h1>HTML to CSS Modules</h1>
      <div className={css.Options}>
        <div className={css.FormField}>
          <label>
            <input
              type="checkbox"
              value={true}
              checked={createClass}
              onChange={(e) => setCreateClass(e.target.checked)}
            />{" "}
            Create class
          </label>
        </div>
        {createClass ? (
          <div className={css.FormField}>
            <label>Class Name</label>
            <input
              ref={outputClassNameEl}
              type="text"
              value={outputClassName}
              onChange={(e) => setOutputClassName(e.target.value)}
            />
          </div>
        ) : null}
        <div className={css.FormField}>
          <label>Helper Pattern</label>
          <input
            type="text"
            value={helperPattern}
            onChange={(e) => setHelperPattern(e.target.value)}
          />
        </div>
      </div>
      <div className={css.Row}>
        <div>
          <h5>Live</h5>
          <textarea
            value={liveCode}
            onChange={(e) => setLiveCode(e.target.value)}
          ></textarea>
        </div>
        <div>
          <h5>Compiled</h5>
          <textarea value={compiledCode}></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
