"use strict";

$(document).ready(function() {
    var $slider = $('.slider');
    var totalSlides = $slider.children().length;

    $slider.bxSlider({
        auto: true,
        mode: 'fade',
        startSlide: Math.floor(Math.random() * totalSlides), // Start with a random slide
        onSlideAfter: function($slideElement, oldIndex, newIndex) {
            var currentSlide = newIndex + 1;
            $('.current-slide').text('Slide ' + currentSlide);
            $('.slide-number').text(currentSlide + ' / ' + totalSlides);
        },
        onSliderLoad: function(currentIndex) {
            var currentSlide = currentIndex + 1;
            $('.current-slide').text('Slide ' + currentSlide);
            $('.slide-number').text(currentSlide + ' / ' + totalSlides);
            $('.total-slides').text(' / ' + totalSlides);
        },
        controls: false, // Disable default controls
        pager: false // Disable default pager (dots)
    });
});
