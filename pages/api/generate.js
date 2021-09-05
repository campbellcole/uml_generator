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
    const python = spawn("python", ["parse.py", req.body.headerData]);
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
        console.log(umlOut);
        console.log(error);
        return res.send("Failed...");
    }
    const encoded = plantuml.encode(umlOut);
    let encodedStr = "";
    for await (const chunk of encoded.out) {
        encodedStr += chunk;
    }
    res.send(`<script> window.location.href = "http://www.plantuml.com/plantuml/png/${encodedStr}";</script>`);
}