const fs = require("fs"),
    path = require('path'),
    Handlebars = require("handlebars");

function render(resume) {
    const normalizeCss = fs.readFileSync(__dirname + "/normalize.css", "utf-8"),
        css = fs.readFileSync(__dirname + "/style.css", "utf-8"),
        tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8"),
        partialsDir = path.join(__dirname, 'partials'),
        filenames = fs.readdirSync(partialsDir);

    Handlebars.registerHelper('and', and);
    Handlebars.registerHelper('or', or);

    filenames.forEach(function (filename) {
        const matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
            return;
        }
        const name = matches[1],
            filepath = path.join(partialsDir, filename),
            template = fs.readFileSync(filepath, 'utf8');

        Handlebars.registerPartial(name, template);
    });
    return Handlebars.compile(tpl)({
        normalizeCss,
        css,
        resume
    });
}

const and = (...params) => {
    const length = params.length - 1;
    return length > 0 ? params.slice(0, length).reduce((acc, p) => acc && p) : false;
};

const or = (...params) => {
    const length = params.length - 1;
    return length > 0 ? params.slice(0, length).reduce((acc, p) => acc || p) : false;
};

module.exports = {
    render: render
};