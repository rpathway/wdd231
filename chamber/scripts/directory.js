let members = [];
let isLoading = false;

async function loadMembers() {
  if (isLoading) return;
  
  isLoading = true;
  const directory = document.getElementById('directory');

  try {
    // Loading flair
    directory.innerHTML = '<div class="loading">Loading members</div>';

    const response = await fetch('data/members.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    members = await response.json();

    displayMembers(members);
  } catch (error) {
    console.error("Error loading members:", error);
    directory.innerHTML = '<div class="error">Unable to load member directory. Please try again later.</div>';

  } finally {
    isLoading = false;
  }
}

function displayMembers(memberList) {
  const directory = document.getElementById('directory');

  if (!memberList || memberList.length === 0) {
    directory.innerHTML = '<div class="error">No members found.</div>';
    return;
  }

  directory.innerHTML = '';

  memberList.forEach((member) => {
    const card = createMemberCard(member);
    directory.appendChild(card);
  });
}

function createMemberCard(member) {
  const membershipInfo = {
    1: ['badge-member', 'Member'],
    2: ['badge-silver', 'Silver Member'],
    3: ['badge-gold',   'Gold Member']
  }
  const card = document.createElement('div');
  card.className = 'member-card';

  const [badgeClass, badgeText] = membershipInfo[member.membershipLevel];

  card.innerHTML = `
    <div class="member-header">
      <img src="images/${member.image}" alt="${member.name} logo" class="member-logo" loading="lazy">
      <div class="member-info">
        <h2>${member.name}</h2>
        <span class="membership-badge ${badgeClass}">${badgeText}</span>
      </div>
    </div>
    <div class="member-details">
      <p><strong>Category:</strong> ${member.category}</p>
      <p><strong>Description:</strong> ${member.description}</p>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Established:</strong> ${member.erected}</p>
    </div>
  `;

  return card;
}

function initViewToggle() {
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const directory = document.getElementById('directory');

  if (gridViewBtn && listViewBtn && directory) {
    gridViewBtn.addEventListener('click', () => {
      directory.className = 'grid-view';

      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
      directory.className = 'list-view';

      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }
}

function initNavigation() {
  const menuButton = document.getElementById('menuButton');
  const navigation = document.querySelector('.navigation');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      navigation.classList.toggle('open');

      if (navigation.classList.contains('open')) {
        menuButton.textContent = '✕';

      } else {
        menuButton.textContent = '☰';
      }
    });
  }
}

function initFooter() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const modifiedElement = document.getElementById('lastModified');
  if (modifiedElement) {
    modifiedElement.textContent = document.lastModified;
  }
}

async function init() {
  initFooter();
  initNavigation();
  initViewToggle();
  
  if (!isLoading && members.length === 0) {
    await loadMembers();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await init();
});