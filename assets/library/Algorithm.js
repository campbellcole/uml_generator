const algorithm = (text) => {
  const flags = [
    " ",
    "\n",
    "//",
    "{",
    "}",
    "\t",
    ",",
    ";",
    "=",
    "<",
    ">",
    ":",
    " =",
    "(",
    ")",
    " {",
    "public:",
    "private:",
    "protected:",
  ];
  let index_of_interests = {};
  flags.forEach((flag) => (index_of_interests[flag] = 0));
  const types = { class: {}, struct: {} };

  let prev = [null, null];
  let prev_identifier = null;
  let current_scope = [null, null, 0];
  let statement = "";
  let declaration_scope = [null, null, 0];
  let initialization = false;
  let current_function = "";
  let is_function = false;
  let protection_status = null;

  for (let i = 0; i < text.length; ) {
    if (
      prev[0] === "//" ||
      prev[0] === "public:" ||
      prev[0] === "private:" ||
      prev[0] === "protected:"
    ) {
      if (prev[0] !== "//") {
        protection_status = prev[0].substring(0, prev[0].length - 1);
      }
      prev = [
        "\n",
        (text.indexOf("\n", i) !== -1 ? text.indexOf("\n", i) : text.length) +
          1,
      ];
      i = prev[1];

      continue;
    }

    flags.forEach(
      (flag) =>
        (index_of_interests[flag] =
          text.indexOf(flag, i) !== -1 ? text.indexOf(flag, i) : text.length)
    );

    prev = Object.entries(index_of_interests).reduce(function (a, b) {
      let ref = { [`${a[1]}`]: a[0], [`${b[1]}`]: b[0] };
      let min = Math.min(a[1], b[1]);
      return [ref[min], min];
    });

    let min_i = prev[1];
    let next_i = min_i !== -1 ? min_i : text.length;

    if (prev_identifier) {
      types[prev_identifier][text.substring(i, next_i)] = {};
      current_scope = [prev_identifier, text.substring(i, next_i), 0];
      prev_identifier = null;
    }

    if (types[text.substring(i, next_i)]) {
      prev_identifier = text.substring(i, next_i);
      protection_status =
        (prev_identifier === "class" && "private") ||
        (prev_identifier === "struct" && "public");
    }

    if (current_scope[2] === 1) {
      declaration_scope[2] += 1 * (prev[0] === "<");
      if (
        (!declaration_scope[2] &&
          (prev[0] === "=" ||
            prev[0] === " =" ||
            prev[0] === ";" ||
            prev[0] === "," ||
            prev[0] === ")")) ||
        prev[0] === " {"
      ) {
        if (!initialization) {
          if (prev[0] === ")") {
          } else if (text.substring(i, next_i) || current_function) {
            let end_of_function = text.substring(i, next_i);
            if (is_function && (prev[0] === ";" || prev[0] === " {")) {
              console.log(text.substring(i, next_i));
              types[current_scope[0]][current_scope[1]][
                current_function.substring(
                  0,
                  current_function.length +
                    (current_function[current_function.length - 1] === " "
                      ? -1
                      : 0)
                ) +
                  ") " +
                  end_of_function
              ] = [
                statement.substring(0, statement.length - 1),
                protection_status,
                is_function,
              ];

              is_function = false;
              statement = "";
            } else if (!is_function) {
              types[current_scope[0]][current_scope[1]][
                text.substring(i, next_i)
              ] = [
                statement.substring(0, statement.length - 1),
                protection_status,
                is_function,
              ];
              console.log(text.substring(i, next_i));
              statement = "";
            }
          }
        }

        initialization = prev[0] === "=" || prev[0] === " =";
      } else if (!initialization) {
        if (prev[0] === "(") {
          is_function = true;
          current_function = text.substring(i, next_i + 1);
        } else {
          if (is_function) {
            current_function += text.substring(i, next_i) + " ";
          } else {
            statement +=
              text.substring(i, next_i) +
              (declaration_scope[2] === 1 ? prev[0] : "");
            statement += statement && declaration_scope[2] === 0 ? " " : "";
          }
        }
      }
      declaration_scope[2] += -1 * (prev[0] === ">");
    }
    current_scope[2] += 1 * (prev[0] === "{") - 1 * (prev[0] === "}");
    i = next_i + 1;
  }
  console.log(types.class);
  return types;
};
export default algorithm;
