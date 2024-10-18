document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('backButton');
    const userCircle = document.getElementById('userCircle');
    const colorPicker = document.getElementById('colorPicker');
    const profilePic = document.getElementById('profilePic');
    const profilePictureInput = document.getElementById('profilePicture');
    const logout = document.getElementById('logout');

    // Check if essential elements are present
    if (!backButton || !userCircle || !colorPicker || !profilePic || !profilePictureInput || !logout) {
        console.error('One or more essential elements are missing in the DOM');
        return;
    }

    // Function to fetch user details from users.json
    async function fetchUserDetails(email) {
        try {
            const response = await fetch('users.json');
            const users = await response.json();  // Users is an array

            if (!Array.isArray(users)) {
                console.error('Expected an array of users');
                return null;
            }

            // Find the user in the array by email
            const user = users.find(user => user.email === email);
            if (user) {
                console.log('User found:', user);

                // Store in sessionStorage
                sessionStorage.setItem('username', user.username); 
                sessionStorage.setItem('email', user.email);

                // Generate and display user initials in the circle
                const userInitials = user.username.split(' ').map(n => n[0]).join('').toUpperCase(); 
                console.log('User initials:', userInitials);
                
                userCircle.textContent = userInitials; // Update user initials in circle

                // Set default or stored profile picture and color
                const storedColor = user.color || '#6c757d';
                const storedProfilePic = user.profilePic || 'default-profile.png'; 

                userCircle.style.backgroundColor = storedColor;
                document.getElementById('header').style.backgroundColor = storedColor;
                colorPicker.value = storedColor;
                profilePic.src = storedProfilePic;

                return user;
            } else {
                console.error('User not found');
                return null;
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }

    // Function to update user details in users.json
    async function updateUserDetails(email, key, value) {
        try {
            const response = await fetch('users.json');
            const data = await response.json();
            console.log('Fetched data for update:', data);
            if (!data.users) {
                console.error('JSON structure is incorrect, expected an object with a "users" property');
                return;
            }
            const user = data.users.find(user => user.email === email);
            if (user) {
                user[key] = value;
                console.log('Updated user details:', user);
                await fetch('users.json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                console.log('User details updated');
            } else {
                console.error('User not found');
            }
        } catch (err) {
            console.error('Error updating users:', err);
        }
    }

    // Color picker change event
    colorPicker.addEventListener('change', function () {
        const newColor = this.value;
        userCircle.style.backgroundColor = newColor;
        document.getElementById('header').style.backgroundColor = newColor;
        const userEmail = sessionStorage.getItem('email');
        sessionStorage.setItem(`${userEmail}_color`, newColor); // Save new color in sessionStorage
        updateUserDetails(userEmail, 'color', newColor); // Update users.json with new color
    });

    // Profile picture upload change event
    profilePictureInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;
                const userEmail = sessionStorage.getItem('email');
                sessionStorage.setItem(`${userEmail}_profilePic`, e.target.result); // Save profile picture in sessionStorage
                updateUserDetails(userEmail, 'profilePic', e.target.result); // Update users.json with new profile pic
            };
            reader.readAsDataURL(file);
        }
    });

    // Logout button event
    logout.addEventListener('click', function () {
        sessionStorage.clear(); // Clear session storage on logout
        window.location.href = 'index-demo.html'; // Redirect to login page
    });

    // Load user settings from sessionStorage
    function loadUserSettings() {
        const userEmail = sessionStorage.getItem('email');
        const userName = sessionStorage.getItem('username') || 'John Doe';
        console.log('Loaded username from sessionStorage:', userName);
        const storedColor = sessionStorage.getItem(`${userEmail}_color`);
        const storedProfilePic = sessionStorage.getItem(`${userEmail}_profilePic`);
        if (storedColor) {
            document.getElementById('header').style.backgroundColor = storedColor;
            colorPicker.value = storedColor;
            userCircle.style.backgroundColor = storedColor;
        }
        if (storedProfilePic) {
            profilePic.src = storedProfilePic;
        }
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
        userCircle.textContent = userInitials; // Set the initials in userCircle
    }

    // Back button functionality
    backButton.addEventListener('click', function () {
        window.history.back(); // Go back to the previous page
    });

    // Example: Handling a login action (fetch user details and apply settings)
    const userEmail = sessionStorage.getItem('email');
    if (userEmail) {
        fetchUserDetails(userEmail).then(user => {
            if (user) {
                loadUserSettings(); // Load settings for this user
            }
        });
    } else {
        loadUserSettings(); // Load settings from sessionStorage if already present
    }
});
