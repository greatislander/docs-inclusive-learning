"use strict";

const fs = require("fs");
const fluidPlugin = require("@fluid-project/eleventy-plugin-fluid");
const navigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const parseTransform = require("./src/transforms/parse-transform.js");

module.exports = function (config) {
    config.setUseGitIgnore(false);

    // Layouts
    config.addLayoutAlias("default", "layouts/default.njk");

    // Plugins
    config.addPlugin(fluidPlugin);
    config.addPlugin(navigationPlugin);
    config.addPlugin(syntaxHighlightPlugin);

    // Transforms
    config.addTransform("parse", parseTransform);

    // Passthrough copy
    config.addPassthroughCopy({"src/assets/images": "assets/images"});
    config.addPassthroughCopy({"src/assets/fonts": "assets/fonts"});
    config.addPassthroughCopy({"node_modules/docs-core/src/static/css": "assets/styles"});
    config.addPassthroughCopy({"node_modules/docs-core/src/static/lib": "lib"});

    // BrowserSync
    config.setBrowserSyncConfig({
        callbacks: {
            ready: (error, browserSync) => {
                const content404 = fs.readFileSync("dist/404.html");

                browserSync.addMiddleware("*", (request, response) => {
                    // Provides the 404 content without redirect.
                    response.write(content404);
                    response.writeHead(404);
                    response.end();
                });
            }
        }
    });

    return {
        dir: {
		  input: "src",
		  output: "dist"
        },
        passthroughFileCopy: true
 	};
};
