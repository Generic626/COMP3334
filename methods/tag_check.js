module.exports = function checkStringTags (og_string){
    return og_string.replace(/[<>\/\\:?+="'.;\(\)-]+/g," ");
}