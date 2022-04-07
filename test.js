var og_string = "<script> \\ : ? + = ; - \" . ( ) ' </script>"
var new_string = og_string.replace(/[<>\/\\:?+="'.;\(\)-]+/g,"");

console.log(new_string);