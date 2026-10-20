fetch("/health")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("status").textContent = "Server status: " + data.status;
  })
  .catch(() => {
    document.getElementById("status").textContent = "Server not reachable";
  });