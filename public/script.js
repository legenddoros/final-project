const inputs = document.querySelectorAll("input");

// Q2 inputs
const q2p1Input = document.querySelector("input[name='q2p1']");
const q2p2Input = document.querySelector("input[name='q2p2']");

// Enable q2p2 only if q2p1 is Yes
q2p1Input.addEventListener("input", () => {
  const val = q2p1Input.value.trim().toLowerCase();
  q2p2Input.disabled = val !== "yes";
});

inputs.forEach((input) => {
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const name = input.name;
      let value = input.value.trim();
      if (!value) return;

      // Convert types
      if (name === "q1" || name === "q5" || name === "q2p1") {
        value = value.toLowerCase() === "yes";
      } else if (name === "q2p2") {
        value = parseInt(value);
        if (isNaN(value)) {
          alert("Please enter a valid number for this question.");
          return;
        }
      }

      // Build payload
      const data = { [name]: value };

      // --- Q2 special case ---
      if (name === "q2p2") {
        const q2p1Current = q2p1Input.value.trim().toLowerCase();
        if (q2p1Current === "yes") {
          data.q2p1 = true;
        } else if (q2p1Current === "no") {
          data.q2p1 = false;
          data.q2p2 = null; // ignore age if No
        } else {
          alert("Please enter Yes or No for Q2 before submitting age.");
          return;
        }
      }

      // If submitting q2p1=No, clear q2p2
      if (name === "q2p1" && !value) {
        data.q2p2 = null;
      }

      try {
        const res = await fetch("/polls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          input.value = "";
          if (name === "q2p1" && !value) q2p2Input.value = "";
        } else {
          const errData = await res.json();
          alert("Error: " + (errData.error || "Unknown Error"));
        }
      } catch (err) {
        console.error(err);
        alert("Network Error.");
      }
    }
  });
});

function getResultsContainer(input) {
  let container = input.parentElement.querySelector(".results");
  if (!container) {
    container = document.createElement("div");
    container.className = "results";
    container.style.marginTop = "0.5rem";
    container.style.fontSize = "0.85rem";
    container.style.maxHeight = "120px";
    container.style.overflowY = "auto";
    input.parentElement.appendChild(container);
  }
  return container;
}

setInterval(async () => {
  try {
    const res = await fetch("/polls");
    if (!res.ok) return;
    const polls = await res.json();

    // --- Q1 ---
    const q1Yes = polls.filter((p) => p.q1 === true).length;
    const q1No = polls.filter((p) => p.q1 === false).length;
    const q1Total = q1Yes + q1No;
    const q1Text = q1Total
      ? `Yes: ${((q1Yes / q1Total) * 100).toFixed(1)}% | No: ${((q1No / q1Total) * 100).toFixed(1)}%`
      : "No responses yet";
    getResultsContainer(
      document.querySelector("input[name='q1']"),
    ).textContent = q1Text;

    // --- Q2 (combined) ---
    const q2Card = document.querySelector("input[name='q2p1']").parentElement;
    let q2ResultsContainer = q2Card.querySelector(".results");
    if (!q2ResultsContainer) {
      q2ResultsContainer = document.createElement("div");
      q2ResultsContainer.className = "results";
      q2ResultsContainer.style.marginTop = "0.5rem";
      q2ResultsContainer.style.fontSize = "0.85rem";
      q2ResultsContainer.style.maxHeight = "120px";
      q2ResultsContainer.style.overflowY = "auto";
      q2Card.appendChild(q2ResultsContainer);
    }

    const q2p1Votes = polls.filter((p) => p.q2p1 !== undefined);
    const q2Yes = q2p1Votes.filter((p) => p.q2p1 === true).length;
    const q2No = q2p1Votes.filter((p) => p.q2p1 === false).length;
    const q2Total = q2Yes + q2No;
    const q2PercentText = q2Total
      ? `Vote Yes/No: Yes ${((q2Yes / q2Total) * 100).toFixed(1)}% | No ${((q2No / q2Total) * 100).toFixed(1)}%`
      : "No responses yet";

    const q2Ages = polls
      .map((p) => p.q2p2)
      .filter((v) => v !== undefined && v !== null);
    const q2Avg = q2Ages.length
      ? (q2Ages.reduce((a, b) => a + b, 0) / q2Ages.length).toFixed(1)
      : "-";
    const q2AgeText = q2Ages.length
      ? `Average age if Yes: ${q2Avg}`
      : "No age responses yet";

    q2ResultsContainer.innerHTML = `
      <div>${q2PercentText}</div>
      <div>${q2AgeText}</div>
    `;

    // --- Q3 ---
    const q3Values = polls.map((p) => p.q3).filter((v) => v);
    getResultsContainer(document.querySelector("input[name='q3']")).innerHTML =
      q3Values.length
        ? q3Values.map((v) => `<div>- ${v}</div>`).join("")
        : "No responses yet";

    // --- Q4 ---
    const q4Values = polls.map((p) => p.q4).filter((v) => v);
    getResultsContainer(document.querySelector("input[name='q4']")).innerHTML =
      q4Values.length
        ? q4Values.map((v) => `<div>- ${v}</div>`).join("")
        : "No responses yet";

    // --- Q5 ---
    const q5Yes = polls.filter((p) => p.q5 === true).length;
    const q5No = polls.filter((p) => p.q5 === false).length;
    const q5Total = q5Yes + q5No;
    const q5Text = q5Total
      ? `Yes: ${((q5Yes / q5Total) * 100).toFixed(1)}% | No: ${((q5No / q5Total) * 100).toFixed(1)}%`
      : "No responses yet";
    getResultsContainer(
      document.querySelector("input[name='q5']"),
    ).textContent = q5Text;
  } catch (err) {
    console.error("Error fetching poll results:", err);
  }
}, 1000);
