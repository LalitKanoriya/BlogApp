
function showpwd(btn){
    document.querySelector(btn)
    .addEventListener('click', function(e){
        inputField = e.target.parentElement.parentElement.previousElementSibling;
        if (inputField.type === "password") {
            inputField.type = "text";
            this.className = 'fas fa-eye';
        } else {
            inputField.type = "password";
            this.className = 'fas fa-eye-slash';
        }
        e.preventDefault();
    });
}

showpwd('.pass-btn');
showpwd('.cnfm-btn');