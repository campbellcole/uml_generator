import { useEffect } from "react";
import algorithm from "../library/Algorithm";
const Editor = ({ set_text_data }) => {
  var editor;
  var beautify;
  useEffect(() => {
    editor = ace.edit("editor");
    beautify = js_beautify;
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/c_cpp");
  });
  return (
    <>
      <button
        id="generate"
        style={{
          borderRadius: "50px",
          border: "1px solid black",
          margin: "10px",
          fontSize: "1.2rem",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={async () => {
          let formatted_text = beautify(editor.getValue());
          editor.session.setValue(formatted_text);
          set_text_data(algorithm(formatted_text));
        }}
      >
        Generate
      </button>
    </>
  );
};

export default Editor;
