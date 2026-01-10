const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const navLinks = document.querySelectorAll('.navigation a');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navigation.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      hamburger.classList.remove('active');
      navigation.classList.remove('open');
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    hamburger.classList.remove('active');
    navigation.classList.remove('open');
  }
});