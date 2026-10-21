const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/api/issues", async (req, res) => {
  const language = req.query.language || "javascript";

  const params = new URLSearchParams({
    q: `label:"good first issue" language:${language} state:open is:issue`,
    sort: "created",
    order: "desc",
    per_page: "10",
  });

  try {
    const response = await fetch(`https://api.github.com/search/issues?${params}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "issue-matcher",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "GitHub request failed" });
    }

    const data = await response.json();

    const issues = data.items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.html_url,
      repo: item.repository_url.replace("https://api.github.com/repos/", ""),
      labels: item.labels.map((label) => label.name),
      createdAt: item.created_at,
    }));

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});