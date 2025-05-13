
const firebaseConfig = {
  apiKey: "AIzaSyCsH042eJMuTj8ngCBZJjfHkwL7qpFM7gA",
  authDomain: "ekloges2027.firebaseapp.com",
  projectId: "ekloges2027",
  storageBucket: "ekloges2027.firebasestorage.app",
  messagingSenderId: "848081634607",
  appId: "1:848081634607:web:ceacfa7d3a0e2394fbcdda",
  measurementId: "G-ELT8V815ZK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const chartCtx = document.getElementById("chart").getContext("2d");
let chart;

function vote(candidate) {
  const voted = localStorage.getItem("voted");
  if (voted) return alert("Έχετε ήδη ψηφίσει!");
  const ref = db.ref("votes/" + candidate);
  ref.transaction(current => (current || 0) + 1);
  localStorage.setItem("voted", "true");
}

function updateChart(data) {
  const values = ["kasidiaris", "mitsotakis", "konstantopoulou", "latinopoulou"].map(k => data[k] || 0);
  if (chart) {
    chart.data.datasets[0].data = values;
    chart.update();
  } else {
    chart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: ["Κασιδιάρης", "Μητσοτάκης", "Κωνσταντοπούλου", "Λατινοπούλου"],
        datasets: [{
          label: "Ψήφοι",
          data: values,
          backgroundColor: ["#f00", "#00f", "#0a0", "#a0f"]
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
}

db.ref("votes").on("value", snapshot => {
  updateChart(snapshot.val() || {});
});

window.onload = () => {
  setTimeout(() => {
    document.querySelector("main").style.display = "block";
    document.getElementById("loader").style.display = "none";
  }, 1500);
};
