module.exports = function checkStringTags (og_string){
    return og_string.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*#?&]).{8,}$/gm," ");
}