// partner-register.js
let BASE_URL = window.CONFIG.BASE_URL;
async function registerPartner(event) {
    event.preventDefault();

    const fullName = document.querySelector('input[name="fullName"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const partnerId = document.querySelector('input[name="partnerId"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const data = { fullName, email, phone, partnerId, password };

    try {
        const response = await axios.post(`${BASE_URL}/register`, data, {
            headers: { "Content-Type": "application/json" }
        });

        alert("Registered successfully!");
        console.log("Response:", response.data);
        location = `./partner-home.html`;

    } catch (error) {
        console.error(error);
        alert("Registration failed!");
    }
}
