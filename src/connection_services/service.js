const apiService = {
  login: async (credentials) => {

    if (!credentials.Email || !credentials.Password) {
      alert("Please fill in all fields!");
      return;
    }  

    console.log("Sending credentials:", credentials);

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(JSON.stringify(errorData))
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    console.log("Response from server: ",data);
    console.log("Login Successful!");

    alert("Login Successful!")

    return data;
  },

  signup: async(credentials) => {

    if (!credentials.Email || !credentials.Password || !credentials.Name) {
      alert("Please fill in all fields!");
      return;
    }

    console.log("Sending credentials:", credentials);

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
         },
        credentials: "include",
        body: JSON.stringify(credentials),
    });
    console.log(response);
    
    if(!response.ok){
        const errorData = await response.json();
        console.log("ERROR in service.js");
        alert(JSON.stringify(errorData))
        throw new Error(errorData.error || "Signup failed");
    }

    const data = await response.json();
    console.log("Response from server:", data);
    console.log("SignUp Successful!");

    return data;
  },

  logout: async () => {
    try {
      // const response = await fetch('/logout', {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logout failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, 

};

export default apiService;
