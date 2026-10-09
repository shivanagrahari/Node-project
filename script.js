const moodSelect = document.getElementById("mood");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", async () => {
  const mood = moodSelect.value;

  if (!mood) {
    result.innerText = "Please select your mood first.";
    return;
  }

  result.innerText = "Generating your journal prompt...";

  try {
    const response = await fetch("/journal-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mood: mood
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    result.innerText = data.journalPrompt;

  } catch (error) {
    console.error(error);

    result.innerText =
      "Sorry, something went wrong. Please try again.";
  }
});