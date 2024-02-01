const sw1 = new Swiper('.sw-popular-tours', {
    direction: 'horizontal',
    autoplay:true,
    slidesPerView: 1,
    breakpoints: {
      // When window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
  
      // When window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
  
      // You can add more breakpoints as needed
    },
    navigation: {
      nextEl: '.next',
      prevEl: '.prev',
    },
  });
const swHero = new Swiper('.sw-hero', {
    direction: 'horizontal',
    effect:'fade',
    autoplay:{
      delay:6000
    },
    slidesPerView: 1,
  });