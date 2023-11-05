window.addEventListener('DOMContentLoaded', () => {
  const closeLeftSideButton = document.getElementById('close-left-side');
  const menuContainer = document.getElementById('menu-container');
  const graphContolsContainer = document.getElementById('graph-controls');

  closeLeftSideButton.addEventListener('click', () => {
    closeLeftSideButton.classList.toggle('active');
    menuContainer.classList.toggle('active');
    graphContolsContainer.classList.toggle('move');
  });
});
