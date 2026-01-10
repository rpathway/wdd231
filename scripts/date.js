const lastModifiedElement = document.getElementById('lastModified');
const currentYearElement = document.getElementById('currentyear');
const currentYear = new Date().getFullYear();

currentYearElement.textContent = currentYear;
lastModifiedElement.textContent = document.lastModified;