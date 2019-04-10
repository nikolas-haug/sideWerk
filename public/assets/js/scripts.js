// for flexbox navbar

// VAN JS alternative
const toggle = document.querySelector('#nav-toggle');
const mobileNavMenu = document.querySelector('.flex-nav-container .main-navigation');

toggle.addEventListener('click', function () {
    console.log('clicked');
    // toggle class active for hamburger button
    this.classList.toggle('active');
    // toggle the open active class on mobile nave menu too
    mobileNavMenu.classList.toggle('open-active');
});