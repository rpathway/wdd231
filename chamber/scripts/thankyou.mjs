import { initCommon } from "./common.mjs";

function displayFormData() {
  const urlParams = new URLSearchParams(window.location.search);
  const firstName = urlParams.get('firstName') || 'N/A';
  const lastName  = urlParams.get('lastName')  || 'N/A';
  const email     = urlParams.get('email')     || 'N/A';
  const mobile    = urlParams.get('mobile')    || 'N/A';
  const businessName = urlParams.get('businessName') || 'N/A';
  const timestamp = urlParams.get('timestamp') || 'N/A';

  document.getElementById('displayFirstName').textContent = firstName;
  document.getElementById('displayLastName').textContent  = lastName;
  document.getElementById('displayEmail').textContent     = email;
  document.getElementById('displayMobile').textContent    = mobile;
  document.getElementById('displayBusinessName').textContent = businessName;

  if (timestamp !== 'N/A') {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    document.getElementById('displayTimestamp').textContent = formattedDate;
  } else {
    document.getElementById('displayTimestamp').textContent = timestamp;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  displayFormData();
});