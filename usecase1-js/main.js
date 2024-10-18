let users = [];
fetch('users.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        users = data;
    })
    .catch(error => console.error('Error fetching user data:', error));

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.querySelector('.btn');
const notification = document.getElementById('notification');

//  enable or disable the submit button
function toggleSubmitButton() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    submitButton.disabled = !(email && password); 
}

emailInput.addEventListener('input', toggleSubmitButton);
passwordInput.addEventListener('input', toggleSubmitButton);

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    
    if (submitButton.disabled) {
        alert('Please fill in both fields before submitting.');
        return; // Exit 
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    // Clear previous error messages and success notifications
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';
    notification.style.display = 'none'; 


    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Successful login
        showNotification('Successful submission!', 'success');


        setTimeout(() => {
            window.location.href = 'dashboard.html'; 
        }, 3000);
    } else {

        if (!users.find(u => u.email === email)) {
            const emailError = document.getElementById('email-error');
            emailError.classList.add('error');
            emailError.innerHTML = 'Email does not match';
            emailError.style.display = 'block'; 
            setTimeout(() => {
                emailError.style.display = 'none'; 
            }, 3000);
        }

        if (users.find(u => u.email === email) && !users.find(u => u.password === password)) {
            const passwordError = document.getElementById('password-error');
            passwordError.classList.add('error');
            passwordError.innerHTML = 'Password does not match';
            passwordError.style.display = 'block'; 
            setTimeout(() => {
                passwordError.style.display = 'none'; 
            }, 3000);
        }

        if (!users.find(u => u.email === email) && !users.find(u => u.password === password)) {
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');

            emailError.classList.add('error');
            emailError.innerHTML = 'Email and Password do not match';
            emailError.style.display = 'block'; 
            passwordError.classList.add('error');
            passwordError.innerHTML = 'Password does not match';
            passwordError.style.display = 'block'; 

            setTimeout(() => {
                emailError.style.display = 'none'; 
                passwordError.style.display = 'none';
            }, 3000);
        }
    }
});


function showNotification(message, type) {
    notification.innerHTML = message;
    notification.className = type === 'success' ? 'msg success' : 'msg error'; 
    notification.style.display = 'block'; 
    notification.style.opacity = '1'; 


    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none'; 
        }, 1000); 
    }, 3000);
}


const passwordField = document.getElementById('password'); 
const togglePasswordIcon = document.getElementById('togglePassword');


if (passwordField && togglePasswordIcon) {
    togglePasswordIcon.addEventListener('click', function () {

        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
} else {
    console.error("Password input or toggle icon not found");
}
