import {useEffect} from "react";
import algorithm from "../library/Algorithm";

const Editor = ({set_text_data}) => {
  var editor;
  var beautify;
  useEffect(() => {
    const script_beautify = document.createElement("script");
    const script_ace = document.createElement("script");
    document.body.appendChild(script_beautify);
    document.body.appendChild(script_ace);
    script_beautify.src =
      "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js";
    script_ace.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js";
    script_beautify.async = false;
    script_ace.async = false;
    script_ace.onload = () => {
      editor = window.ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.session.setMode("ace/mode/c_cpp");
    };
    script_beautify.onload = () => {
      beautify = window.js_beautify;
    };
  });
  return (
    <>
      <form action="/api/generate" method="POST" id="generateUML">
        <input type="hidden" name="headerData" id="headerData" />
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
            document.getElementById("headerData").value = formatted_text;
            document.getElementById("generateUML").submit();
            //set_text_data(algorithm(formatted_text));
          }}
        >
          Generate
        </button>
      </form>
    </>
  );
};

export default Editor;
