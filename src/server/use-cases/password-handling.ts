const users = [{ username: "admin", password: "12345" }]; // Storing plaintext passwords

export const login = (user: string, pass: string) => {
  const foundUser = users.find((u) => u.username === user);
  if (foundUser && foundUser.password === pass) {
    // Direct comparison
    console.log("Login successful!");
  } else {
    console.log("Invalid credentials.");
  }
};

login("admin", "12345"); // Simulated login attempt
