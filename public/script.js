const languageSelect = document.getElementById("language");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const results = document.getElementById("results");

async function loadIssues() {
  message.textContent = "Loading...";
  results.innerHTML = "";

  try {
    const res = await fetch(`/api/issues?language=${languageSelect.value}`);
    const issues = await res.json();

    if (!res.ok) {
      message.textContent = issues.error || "Something went wrong";
      return;
    }

    if (issues.length === 0) {
      message.textContent = "No issues found.";
      return;
    }

    message.textContent = `Found ${issues.length} issues`;

    issues.forEach((issue) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = issue.url;
      link.textContent = issue.title;
      link.target = "_blank";
      link.rel = "noopener";

      const repo = document.createElement("div");
      repo.className = "repo";
      repo.textContent = issue.repo;

      const labels = document.createElement("div");
      labels.className = "labels";
      labels.textContent = issue.labels.join(", ");

      li.append(link, repo, labels);
      results.appendChild(li);
    });
  } catch (err) {
    message.textContent = "Could not reach the server.";
  }
}

searchBtn.addEventListener("click", loadIssues);
loadIssues();