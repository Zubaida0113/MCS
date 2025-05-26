
window.addEventListener("load", async () => {
  await Clerk.load();

  if (Clerk.user) {
    document.getElementById("welcome").style.display = "block";
    document.getElementById("welcome").innerText = 
      "Welcome, " + Clerk.user.fullName;
  }
});

  async function handleSignOut() {
    try {
      await Clerk.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  window.addEventListener("load", async () => {
    try {
      await Clerk.load();
      
      const signedOutButtons = document.getElementById("signed-out-buttons");
      const signedInButtons = document.getElementById("signed-in-buttons");
      const welcomeDiv = document.getElementById("welcome");

      if (Clerk.user) {
        signedOutButtons.style.display = "none";
        signedInButtons.style.display = "flex";
        welcomeDiv.innerText = `Welcome, ${Clerk.user.fullName}`;
      } else {
        signedOutButtons.style.display = "flex";
        signedInButtons.style.display = "none";
      }
    } catch (error) {
        console.error('Error initializing Clerk:', error);
    }
  });
