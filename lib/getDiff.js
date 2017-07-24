const jsDiff = require("diff");

function getDiff(oldText, newText) {
    const diff = jsDiff.diffChars(oldText, newText);

    let added = [];
    diff.forEach(function (part) {
        if(part.added) {
            added.push(part.value);
        }
    });

    return added.join();
}

module.exports = getDiff;