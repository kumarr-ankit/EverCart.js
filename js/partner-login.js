// partner-register.js
let BASE_URL = window.CONFIG.BASE_URL;
async function loginPartner(event) {
  event.preventDefault();

  const email = document.querySelector('input[name="email"]').value;

  const password = document.querySelector('input[name="password"]').value;

  const data = { email, password };

  try {
    const response = await axios
      .post(`${BASE_URL}/api/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        alert("Registered successfully!");

        localStorage.setItem('partner-token',res.data.token);
        console.log("Response:", res.data);
        location = `./partner-home.html`;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error(error);
    alert("Registration failed!");
  }
}
