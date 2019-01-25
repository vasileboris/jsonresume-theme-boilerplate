const fs = require("fs"),
    path = require('path'),
    Handlebars = require("handlebars");

function render(resume) {
    const css = fs.readFileSync(__dirname + "/style.css", "utf-8"),
        tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8"),
        partialsDir = path.join(__dirname, 'partials'),
        filenames = fs.readdirSync(partialsDir);

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
        css,
        resume
    });
}

module.exports = {
    render: render
};