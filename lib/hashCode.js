module.exports = function (str) {
    let hash = 0;
    if (str.length === 0) return hash;
    let char;
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}