const burger = document.querySelector('.burger-btn')
burger.addEventListener('click', () => {
  burger.classList.toggle('burger-btn-close')
  if (!burger.classList.contains('burger-btn burger-btn-close')) {
    document.querySelector('.burger-menu-list').classList.toggle('hide')
  }
})
