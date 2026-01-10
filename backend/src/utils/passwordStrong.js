const strongPassword = (password)=>{

    const validate = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&*])(?=.*[0-9]).{8,}$/

    return validate.test(password)
}

export {strongPassword}