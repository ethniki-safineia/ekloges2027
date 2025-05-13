
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

document.getElementById('loading').style.display = 'none';

function vote(candidate) {
  const voted = localStorage.getItem('voted2027');
  if (voted) {
    alert("Έχετε ήδη ψηφίσει!");
    return;
  }
  db.ref('votes/' + candidate).transaction(current => (current || 0) + 1);
  localStorage.setItem('voted2027', 'true');
  alert("Η ψήφος σας καταχωρήθηκε!");
}

const ctx = document.getElementById('resultsChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Κασιδιάρης', 'Μητσοτάκης', 'Κωνσταντοπούλου', 'Λατινοπούλου'],
    datasets: [{
      label: 'Ψήφοι',
      data: [0, 0, 0, 0],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } }
  }
});

function updateChart() {
  db.ref('votes').on('value', snapshot => {
    const data = snapshot.val() || {};
    chart.data.datasets[0].data = [
      data.kasidiaris || 0,
      data.mitsotakis || 0,
      data.konstantopoulou || 0,
      data.latinopoulou || 0
    ];
    chart.update();
  });
}

updateChart();
