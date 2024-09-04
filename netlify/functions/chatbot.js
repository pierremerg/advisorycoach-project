<!-- HTML for Chatbot Interface -->
<div id="chatbot-container" style="max-width: 500px; margin: 50px auto; position: relative; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <!-- Main Glass Container -->
  <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px) saturate(150%); border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.2); padding: 20px; position: relative; z-index: 2; overflow: hidden;">

    <!-- Top Bar for Time, Signal, and Branding -->
    <div id="top-bar" style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: white; text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-top: 5px; margin-bottom: 10px;">
      <div id="current-time" style="text-align: left; flex: 1;">Loading... (Paris)</div>
      <div id="branding" style="display: flex; align-items: center; justify-content: flex-end; flex: 1;">
        <span>Connected</span>
        <div id="signal-bars" style="display: flex; gap: 2px; margin-left: 8px;">
          <!-- Corrected Fake Signal Bars -->
          <div style="width: 4px; height: 8px; background-color: white; opacity: 0.3;"></div>
          <div style="width: 4px; height: 12px; background-color: white; opacity: 0.5;"></div>
          <div style="width: 4px; height: 16px; background-color: white; opacity: 0.7;"></div>
          <div style="width: 4px; height: 20px; background-color: white; opacity: 1;"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <h2 style="text-align: center; color: white; text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-top: 40px; font-size: 6px;">(SCENTADVISOR)</h2>

    <!-- Logo Container -->
    <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(51, 51, 51, 0.3); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <img src="https://cdn.shopify.com/s/files/1/0773/7593/0704/files/logo_round_classic.png?v=1707155167" alt="Logo" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;">
    </div>

    <!-- Chat Output Area -->
    <div id="chat-output" style="border: none; padding: 15px; height: 300px; overflow-y: auto; border-radius: 10px; display: flex; flex-direction: column; gap: 10px;">
      <!-- Chat messages will be dynamically added here -->
    </div>

    <!-- Input and Send Button -->
    <div style="display: flex; margin-top: 20px; gap: 10px;">
      <input type="text" id="user-input" placeholder="Type your message here..." style="flex: 1; padding: 15px; border-radius: 20px; border: none; background-color: rgba(255, 255, 255, 0.1); color: white; outline: none; transition: all 0.3s ease; font-size: 16px;" />
      <button id="send-button" onclick="sendMessage()" style="padding: 15px 20px; background-color: rgba(255, 255, 255, 0.2); color: white; border: none; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; font-size: 16px; backdrop-filter: blur(5px);">Send</button>
    </div>

  </div>

  <!-- Static Gradient Background -->
  <div id="gradient-background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; filter: blur(15px); background: linear-gradient(45deg, rgba(198, 249, 31, 0.1), rgba(0,204,255,0.1));"></div>
</div>

<!-- JavaScript to Handle Form Submission and Display Response -->
<script>
  // Function to display current time in Paris
  function updateTime() {
    const parisTime = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-time').textContent = `${parisTime} (Paris)`;
  }

  // Call updateTime initially and then update every minute
  updateTime();
  setInterval(updateTime, 60000);

  async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatOutput = document.getElementById("chat-output");

    if (!userInput) return; // Do nothing if input is empty

    // Create user message bubble with fade-in effect
    const userMessage = document.createElement("div");
    userMessage.style.display = 'flex';
    userMessage.style.justifyContent = 'flex-end';
    userMessage.style.animation = 'fadeIn 0.6s ease-out';
    userMessage.innerHTML = `<div style="background: rgba(255, 255, 255, 0.1); padding: 10px 15px; border-radius: 20px; display: inline-block; color: white; max-width: 70%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 14px;">${userInput}</div>`;
    chatOutput.appendChild(userMessage);

    // Clear input field
    document.getElementById("user-input").value = '';

    try {
      // Send user input to Netlify function
      const response = await fetch('https://elegant-kangaroo-5c2807.netlify.app/.netlify/functions/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      // Get JSON response
      const data = await response.json();

      // Create bot reply bubble with fade-in effect
      const botMessage = document.createElement("div");
      botMessage.style.display = 'flex';
      botMessage.style.justifyContent = 'flex-start';
      botMessage.style.animation = 'fadeIn 0.6s ease-out';
      botMessage.innerHTML = `<div style="background: rgba(255, 255, 255, 0.1); padding: 10px 15px; border-radius: 20px; display: inline-block; color: white; max-width: 70%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 14px;">${data.reply}</div>`;
      chatOutput.appendChild(botMessage);
    } catch (error) {
      // Handle errors
      const errorMessage = document.createElement("div");
      errorMessage.style.display = 'flex';
      errorMessage.style.justifyContent = 'flex-start';
      errorMessage.style.animation = 'fadeIn 0.6s ease-out';
      errorMessage.innerHTML = `<div style="background: rgba(255, 0, 0, 0.1); padding: 10px 15px; border-radius: 20px; display: inline-block; color: white; max-width: 70%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 14px;">Error: Something went wrong. Please try again.</div>`;
      chatOutput.appendChild(errorMessage);
    }

    // Scroll to the bottom of the chat output
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
</script>

<!-- Additional CSS for Animations -->
<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Hover effect for the Send button */
  #send-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border: 2px solid #C6F91F;
  }

  /* Active/clicked effect for the Send button */
  #send-button:active {
    background-color: #C6F91F;
    color: black;
  }

  /* Reflection effect to enhance glass look */
  .reflection {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
    pointer-events: none;
    mix-blend-mode: screen;
  }

  /* Adding reflection to main glass container */
  #chatbot-container > div::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
    pointer-events: none;
    mix-blend-mode: screen;
  }
</style>
