const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");


function formatTitle(slug) {
    return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

module.exports = function (eleventyConfig) {
    async function imageShortcode(src, alt) {

        let metadata = await Image(src, {
            widths: [400, 800, 1200, 1600],
            formats: ["webp", "jpeg"],
            outputDir: "./_site/img/",
            urlPath: "/img/"
        });

        const largest = metadata.jpeg[metadata.jpeg.length - 1];
        const imageAttributes = {
            alt,
            loading: "lazy",
            decoding: "async"
        };

        const imgHTML = Image.generateHTML(metadata, imageAttributes);

        return `
        <a href="${largest.url}"
        class="gallery-item"
        data-pswp-width="${largest.width}"
        data-pswp-height="${largest.height}">
        ${imgHTML}
        </a>`;
    }

    eleventyConfig.addPlugin(require("@quasibit/eleventy-plugin-sitemap"), {
        sitemap: {
            hostname: "https://biemmezeta.com"
        }
    });

    eleventyConfig.addPassthroughCopy("photos/hero");
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy({
        "node_modules/photoswipe/dist": "js/photoswipe"
    });
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("favicon.ico");

    // leggere automaticamente le cartelle foto
    const fs = require("fs");
    const path = require("path");

    eleventyConfig.addGlobalData("heroImages", () => {
        const heroDir = "./photos/hero";
        const files = fs.readdirSync(heroDir)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        return files.map(file => `./photos/hero/${file}`);

    });

    eleventyConfig.addGlobalData("randomHero", () => {
        const heroDir = "./photos/hero";
        const files = fs.readdirSync(heroDir)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        const random = files[Math.floor(Math.random() * files.length)];

        return `/photos/hero/${random}`;

    });

    eleventyConfig.addGlobalData("galleries", () => {

        const base = path.join(process.cwd(), "photos");

        return fs.readdirSync(base)
            .filter(name =>
                name !== "hero" &&
                fs.statSync(path.join(base, name)).isDirectory()
            )
            .map(category => {

                const folder = path.join(base, category);

                const photos = fs.readdirSync(folder)
                    .filter(file =>
                        /\.(jpg|jpeg|png|webp)$/i.test(file)
                    )
                    .map(file => `photos/${category}/${file}`);

                return {
                    name: category,
                    title: formatTitle(category),
                    photos
                };

            });

    });

    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };

};