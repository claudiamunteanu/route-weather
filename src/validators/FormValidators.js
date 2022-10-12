export const validateHomeForm = (startCity, destCity, willSubscribe, email, startTime, text) => {
    if (startCity === destCity)
        return {error: true, message: text.formValidators.identicalCities}
    if (willSubscribe && email === ''){
        return {error: true, message: text.formValidators.emptyEmail}
    }
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (willSubscribe && !email.match(validRegex)){
        return {error: true, message: text.formValidators.invalidEmailFormat}
    }

     if(willSubscribe && startTime===''){
         return {error: true, message: text.formValidators.emptyStartingTime}
     }
    return {error: false, message: ""}
}

export const validateLoginForm = (email, password, text) => {
    if (email === ''){
        return {error: true, message: text.formValidators.emptyEmail}
    }
    if (password === ''){
        return {error: true, message: text.formValidators.emptyPassword}
    }
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)){
        return {error: true, message: text.formValidators.invalidEmailFormat}
    }
    return {error: false, message: ""}
}

export const validateNewAccountForm = (email, username, password, confirmPassword, text) => {
    if (email === ''){
        return {error: true, message: text.formValidators.emptyEmail}
    }
    if (username === ''){
        return {error: true, message: text.formValidators.emptyUsername}
    }
    if (password === ''){
        return {error: true, message: text.formValidators.emptyPassword}
    }
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)){
        return {error: true, message: text.formValidators.invalidEmailFormat}
    }
    if(password !== confirmPassword){
        return {error: true, message: text.formValidators.differentPasswords}
    }
    return {error: false, message: ""}
}

export const validateDrivingTip = (tipText, categories, text) => {
    if(tipText === ''){
        return {error: true, message: text.formValidators.emptyText}
    }
    if(categories.length===0){
        return {error: true, message: text.formValidators.emptyCategories}
    }
    return {error: false, message: ""}
}