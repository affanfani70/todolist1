
module.exports = getDate;
function getDate(){
    let date = new Date();
    let options = {
        weekday: 'long',
        month: "long",
        day: 'numeric'
    }
    let day = date.toLocaleDateString("us-en", options);
    return day;
}
