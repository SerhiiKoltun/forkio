const navigationMenuIcon = document.querySelector('.navigation__menu');
const navigationList = document.querySelector('.navigation__list');
const navigationLinks = document.querySelectorAll('.navigation__link');

navigationMenuIcon.addEventListener('click', function (event) {
    navigationMenuIcon.classList.toggle('active_menu');
    navigationList.classList.toggle('active_menu');
});

navigationList.addEventListener('click', function (event) {
    navigationLinks.forEach(function(link) {
        if(link.classList.contains('active_link')) {
            link.classList.remove('active_link');
        } 
    })
    event.target.classList.add('active_link');
});
