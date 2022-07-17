
function getSequnceId() {
    return Math.floor(Math.random() * 1000000000);
}

function getEmpId() {
    return Math.floor(Math.random() * 10000);
}

function parseError(e) {
    let message;
    const errObj = (e.errors || {});
    for (let key in errObj) {
        message = errObj[key]["message"] || "";
    }
    return message;
}

module.exports = { getSequnceId, getEmpId ,parseError};