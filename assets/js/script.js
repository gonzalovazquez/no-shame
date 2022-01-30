var $window = $(window),
    $body = $('body');

function showVisibleSlide(carousel, slidesCount) {
    var $slider = $(carousel.$el),
        currentIndex = carousel.realIndex,
        slidesCount,
        i;

    if(carousel.currentBreakpoint <= 767) {
        slidesCount = carousel.params.breakpoints[767].slidesPerView;
    } else {
        slidesCount = carousel.params.slidesPerView;
    }

    $slider.find('.swiper-slide').removeClass('slide-show');

    for(i = currentIndex; i < (currentIndex + slidesCount); i++) {
        $slider.find('.swiper-slide').eq(i).addClass('slide-show');
    }
}

var fn = {

    /*
		Launch
	*/

	Launch: function () {
        fn.Navigation();
        fn.ContentLoad();
        fn.Portfolio();
        fn.IntroCanvas();
        fn.Carousels();
        fn.App();
	},

    /*
        Navigation
    */

    Navigation: function() {

        $('.offcanvas').append('<a href="#" class="navigation__close"></a>');

        $('.mobile-nav__open').on('click', function(e) {
    		e.preventDefault();

    		$body.addClass('mobile-nav-active');
    	});

        $('html').on('click', '.navigation__close', function(e) {
    		e.preventDefault();

    		$body.removeClass('mobile-nav-active');
    	});

        $('.navigation ul ul, .mobile-nav ul ul').closest('li').addClass('has-children');
        $('.navigation ul, .mobile-nav ul').closest('li').find('> a').append('<i class="fa fa-chevron-right"></i>');

    	$('.mobile-nav .has-children').on('click', '> a', function(e) {
    		e.preventDefault();

            var $menuItem = $(this).closest('li');

            if($menuItem.hasClass('children-active')) {
                $menuItem.find('> ul').slideUp(300);
            } else {
                $menuItem.find('> ul').slideDown(300);
            }

            $menuItem.toggleClass('children-active');
    	});

    },

    /*
        Content Load
    */

    ContentLoad: function() {

    	$('[data-animate]').each(function() {
            var $this = $(this),
                classAdd = ($this.data('animate') === '') ? 'fadeIn' : $this.data('animate');

            $this.viewportChecker({
                classToAdd: classAdd,
                offset: 100,
            });
    	});

        // Counter up

        $('[data-counter-up]').each(function() {
            var $counterUp  = $(this),
            $counterValue   = $counterUp.text();

            $counterUp.viewportChecker({
                callbackFunction: function(elem, action) {
                    $counterUp.prop('counter', 0).animate({
                        counter: $counterValue
                    }, {
                        duration: 1500,
                        step: function (now) {
                            $counterUp.text(Math.ceil(now));
                        }
                    });
                }
            });
        });

    },

    /*
        Portfolio
    */

    Portfolio: function() {

        $('[data-filter]').on('click', 'a', function(e) {
            e.preventDefault();

            var $this = $(this);

            $this.closest('ul').find('li').removeClass('active');
            $this.closest('li').addClass('active');
        });

        if($('.filter-container').length) {
        	new Filterizr('.filter-container', {
                layout: 'sameWidth',
            });
        }
    },

    /*
        Intro Canvas
    */

    IntroCanvas: function() {

        const canvas = document.getElementById('intro__canvas');
        if(canvas) {
            const ctx = canvas.getContext('2d');
            let width = canvas.width = canvas.offsetWidth;
            let height = canvas.height = canvas.offsetHeight;

            const colours = JSON.parse( canvas.getAttribute('data-colors') );

            const maxParticles = 200;
            let particles = [];

            // init client x and y values
            let cx = width / 2;
            let cy = height / 2;

            /*window.addEventListener('mousemove', (e) => {
                var bounds = canvas.getBoundingClientRect();

                cx = e.clientX - bounds.left;
                cy = e.clientY - bounds.top;
            });*/


            class Particle {
                constructor(x, y, vx, vy, radius, colour) {
                    this.x = x;
                    this.y = y;
                    this.vx = vx;
                    this.vy = vy;
                    this.radius = radius;
                    this.colour = colour;
                }
                move() {
                    // Reset particle if it goes off screen
                    if (this.y > height || this.y < 0 || this.x > width || this.x < 0) {
                        this.reset();
                    }
                    // Move particles with respect to velocity vectors
                    this.x += this.vx;
                    this.y += this.vy;
                }
                reset() {
                    this.x = cx;
                    this.y = cy;
                    this.vx = 2 + Math.random() * - 4;
                    this.vy = 2 + Math.random() * - 4;
                    this.radius = 1 + Math.random() * 3;
                }
                draw(ctx) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = this.colour;
                    ctx.fill();
                }
            }

            function initParticles() {
                for (let i = 0; i < maxParticles; i++) {
                    setTimeout(createParticle, 10 * i, i);
                }
            }

            function createParticle(i) {
                let p = new Particle(
                    Math.floor(Math.random() * width), // x
                    Math.floor(Math.random() * height), // y
                    1.5 + Math.random() * - 3, // vx
                    1.5 + Math.random() * - 3, // vy
                    1 + Math.random(), // radius
                    colours[Math.floor(Math.random() * colours.length)]
                );
                particles.push(p);
            }


            function loop() {
                ctx.clearRect(0, 0, width, height);
                for (let particle of particles) {
                    particle.move();
                    particle.draw(ctx);
                }
                requestAnimationFrame(loop);
            }

            // Start animation
            initParticles();
            loop();


            // Resize canvas - responsive
            window.addEventListener('resize', resize);
            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        }
    },

    /*
		Carousels
	*/

	Carousels: function () {

        new Swiper('.carousel-stepline', {
            slidesPerView: 3,
            spaceBetween: 40,
            grabCursor: true,
            breakpoints: {
                767: {
                    slidesPerView: 1,
                }
            },
            on: {
                init: function () {
                    showVisibleSlide(this);
                },
                slideChange: function () {
                    showVisibleSlide(this);
                },
                resize: function () {
                    showVisibleSlide(this);
                },
            }
        });

        new Swiper('.carousel-testimonial', {
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

        new Swiper('.picture-carousel', {
            loop: true,
            speed: 1000,
            effect: 'fade',
            autoplay: {
                delay: 3000,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    },

    /*
		App
	*/

	App: function () {

        $window.on('scroll', function() {

        	var $window          = $(this),
                $header          = $('.header'),
        		scrollPx         = $window.scrollTop(),
                navHeight        = $('.header__nav').outerHeight(),
                $contactSection  = $('[data-show-contact-btn]'),
                $floatingSection = $('[data-show-floating-items]'),
                $headerOptions   = $('.header__options');

            // Toggle fixed header

            if( scrollPx > navHeight ) {
        		$header.addClass('header--fixed');
                $headerOptions.addClass('header__options--fixed');
        	} else {
        		$header.removeClass('header--fixed');
                $headerOptions.removeClass('header__options--fixed');
        	}

        }).trigger('scroll');

    },

};

fn.Launch();
