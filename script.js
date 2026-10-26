
const moodSelect = document.getElementById("mood");
const generateBtn = document.getElementById("generateBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");
const promptText = document.getElementById("promptText");

generateBtn.addEventListener("click", async () => {
  const mood = moodSelect.value;

  // Check whether the user selected a mood
  if (!mood) {
    status.textContent = "Please select your mood first.";
    result.hidden = true;
    return;
  }

  // Show loading status
  generateBtn.disabled = true;
  status.textContent = "Creating your journal prompt...";
  result.hidden = true;

  try {
    // Send the mood to the Express backend
    const response = await fetch("/journal-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mood })
    });

    const data = await response.json();

    // Handle backend errors
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    // Display the generated prompt
    promptText.textContent = data.prompt;
    result.hidden = false;
    status.textContent = "Your journal prompt is ready!";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    // Enable the button again
    generateBtn.disabled = false;
  }
});
