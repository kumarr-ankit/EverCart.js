document.addEventListener("DOMContentLoaded", () => {
  let BASE_URL = window.CONFIG.BASE_URL;
  const form = document.querySelector("form");
  const emailInput = document.querySelector("input[type='email']");
  const passwordInput = document.querySelector("input[type='password']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page refresh

    const payload = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // EXPECTING TOKEN FROM SPRING BOOT
      const token = response.data.token;

      if (!token) {
        alert("Invalid response: token missing");
        return;
      } else {
        // Save token to localStorage
        console.log("Before Login Token", localStorage.getItem("token"));
        console.log("token from Server", token);
        localStorage.setItem("token", token);
        console.log("After Login Token ", localStorage.getItem("token"));
        localStorage.setItem("token", token);
        localStorage.setItem("isLogged", true);

        if(token == localStorage.getItem("token")){
            console.log("same Token");
        }else{
            console.log("different token found. 👍")
        }

        // Navigate to home
        setTimeout(() => {
          window.location.href = "./home.html";
        }, 1000);
      }
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
