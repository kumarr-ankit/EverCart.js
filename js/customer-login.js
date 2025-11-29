document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // stop page refresh

        const payload = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // EXPECTING TOKEN FROM SPRING BOOT
            const token = response.data.token;  

            if (!token) {
                alert("Invalid response: token missing");
                return;
            }

            // Save token to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("everCart-isLogged",true);

            // Navigate to home
            setTimeout(() => {
                 window.location.href = "./home.html";
            }, 9000);

        } catch (err) {
            console.error(err);

            if (err.response && err.response.status === 401) {
                alert("Invalid email or password");
            } else {
                alert("Something went wrong. Try again.");
            }
        }
    });
});
