import * as plantuml from "node-plantuml";
import {v4} from "uuid";
import fs from "fs";
import {spawn} from "child_process";

var init = false;

export const config = {
    api: {
        externalResolver: true,
    }
};

export default async function handler(req, res) {
    if (req.method !== "POST" || !req.body.headerData) {
        return res.send("Invalid request.");
    }
    if (!init) {
        plantuml.useNailgun();
        init = true;
    }
    const filename = v4() + ".hpp";
    const tempPath = `./${filename}`;
    fs.writeFileSync(tempPath, req.body.headerData);
    const python = spawn("hpp2plantuml", ["-i", tempPath]);
    let umlOut = "";
    for await (const chunk of python.stdout) {
        umlOut += chunk;
    }
    let error = "";
    for await (const chunk of python.stderr) {
        error += chunk;
    }
    const exitCode = await new Promise((resolve) => {
        python.on("close", resolve);
    });
    if (exitCode !== 0) {
        return res.send("Failed...");
    }
    const encoded = plantuml.encode(umlOut);
    let encodedStr = "";
    for await (const chunk of encoded.out) {
        encodedStr += chunk;
    }
    fs.rmSync(tempPath);
    res.send(`<script> window.location.href = "http://www.plantuml.com/plantuml/png/${encodedStr}";</script>`);
}