const closeLeftSideButton = document.getElementById('close-left-side');
const menuContainer = document.getElementById('menu-container');

window.addEventListener('DOMContentLoaded', () => {
  closeLeftSideButton.addEventListener('click', () => {
    closeLeftSideButton.classList.toggle('active');
    menuContainer.classList.toggle('active');
  });
});
