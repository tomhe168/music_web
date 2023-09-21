var swiper1 = new Swiper(".mySwiper1", {
    centeredSlides: true,
    centeredSlidesBounds:true,
    centerInsufficientSlides: true,
    slidesPerView: "auto",
    // spaceBetween: 30,
    on: {
        slideChange: function() {
            const ids = ['e-collapse1', 'e-collapse2', 'e-collapse3', 'e-collapse4','e-collapse5','e-collapse6'];
            ids.forEach(id => {
                let collapseElem = document.getElementById(id);
                if (collapseElem && collapseElem.classList.contains('show')) {
                    new bootstrap.Collapse(collapseElem).hide();
                }
            });
        }
    }
});


var swiper2 = new Swiper(".mySwiper2", {
    centeredSlides: true,
    centeredSlidesBounds:true,
    centerInsufficientSlides: true,
    slidesPerView: "auto",
    // spaceBetween: 30,
});