const registerValidator = (username, email, password, confirmPassword) => {
    let errors ={};
    const passRegEx = /^.{6,}$/;
    const emailRegEx = /^([\w\d\.-]+)@([\w\d-]+)[\.]([a-z]{2,8})(.[a-z]{2,8})*$/;

    if(username.trim() === "") {
        errors.username = "You must use a valid username";
    }
    if(email.trim() === "" || !emailRegEx.test(email)) {
        errors.email = "You must use a valid e-mail";
    }

    if(password === "" || !passRegEx.test(password)) {
        errors.password = "Your password must be minimum 6 character long";
    }else if(password !== confirmPassword) {
        errors.confirmPassword = "Your password didn't match"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1 ? true : false
    }
}

module.exports = { registerValidator };