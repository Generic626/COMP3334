var email = "john.doe@example.com";
var name_   = email.substring(0, email.lastIndexOf("@"));
var domain = email.substring(email.lastIndexOf("@") +1);

console.log( name_ );   // john.doe
console.log( domain ); // example.com
