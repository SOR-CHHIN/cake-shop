
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
     // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB5ewCYvOb5SBGyHBIAhvI4CYLeX26UT5Q",
    authDomain: "my-profile-8c295.firebaseapp.com",
    projectId: "my-profile-8c295",
    storageBucket: "my-profile-8c295.firebasestorage.app",
    messagingSenderId: "211039922845",
    appId: "1:211039922845:web:7744f3511a5916c0c4c274"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
    // Edit toggle function with Firebase save
    function toggleEdit(fieldId) {
      const field = document.getElementById(fieldId);
      const display = document.getElementById(`${fieldId}Display`);
      const currentValue = display.textContent;

      if (field.style.display === 'none' || !field.style.display) {
        field.style.display = 'inline-block';
        field.focus();
      } else {
        field.style.display = 'none';
        const newValue = field.value || currentValue;
        display.textContent = newValue;

        // Save to Firebase
        const userRef = database.ref('users/jeremy'); // Replace 'jeremy' with a unique user ID
        userRef.update({
          [fieldId]: newValue
        }).then(() => {
          console.log(`${fieldId} saved to Firebase`);
        }).catch((error) => {
          console.error("Error saving to Firebase:", error);
        });

        // Update link for the site field
        if (fieldId === 'site') {
          display.innerHTML = `<a href="http://${newValue}">${newValue}</a>`;
        }
      }
    }

    // Load data from Firebase
    function loadData() {
      const userRef = database.ref('users/jeremy'); // Replace 'jeremy' with a unique user ID
      userRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          document.getElementById('addressDisplay').textContent = data.address || '170 William Street Primary, New York, NY 10338 213 310-31 Metropolis';
          document.getElementById('museumDisplay').textContent = data.museum || '515 6th Street, New York, NY 10031 175 186-47';
          document.getElementById('phoneDisplay').textContent = data.phone || '+1 123 455 7890';
          document.getElementById('emailDisplay').textContent = data.email || 'hello@jeremyrose.com';
          document.getElementById('siteDisplay').innerHTML = data.site ? `<a href="http://${data.site}">${data.site}</a>` : '<a href="http://www.jeremyrose.com">www.jeremyrose.com</a>';
          document.getElementById('birthdayDisplay').textContent = data.birthday || 'June 5, 1992';
          document.getElementById('genderDisplay').textContent = data.gender || 'Male';
          document.getElementById('interestDisplay').textContent = data.interest || 'Art, Design, Print & Editorial';
        }
      }).catch((error) => {
        console.error("Error loading data:", error);
      });
    }

    // Action button handlers
    function sendMessage() {
      alert('Send Message functionality to be implemented.');
    }

    function contactUser() {
      alert('Contact functionality to be implemented.');
    }

    function reportUser() {
      if (confirm('Are you sure you want to report this user?')) {
        alert('Report submitted.');
      }
    }

    // Load data when the page loads
    window.onload = loadData;