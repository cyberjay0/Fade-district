/* =========================================================================
   FADE DISTRICT BARBERSHOP: MAIN APPLICATION SCRIPT
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================================================
       1. PRELOADER CONTROLLER
       ========================================================================= */
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            // Keep loader visible for a brief moment for luxury transition feel
            setTimeout(() => {
                preloader.classList.add("fade-out");
            }, 800);
        });
        
        // Safety timeout in case load event takes too long
        setTimeout(() => {
            if (!preloader.classList.contains("fade-out")) {
                preloader.classList.add("fade-out");
            }
        }, 3000);
    }

    /* =========================================================================
       2. STICKY HEADER & NAV ACTIVE STATES
       ========================================================================= */
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll listener for sticky header
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
        
        // Highlight active navigation section
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop-120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });

    /* =========================================================================
       3. MOBILE NAVIGATION DRAWER
       ========================================================================= */
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu on clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    /* =========================================================================
       4. SCROLL REVEAL & STAGGERED ANIMATIONS
       ========================================================================= */
    const animElements = document.querySelectorAll(".scroll-anim");

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Read staggered animation delay from data attribute
                const delay = element.getAttribute("data-delay");
                if (delay) {
                    element.style.transitionDelay = delay;
                }
                
                element.classList.add("visible");
                scrollObserver.unobserve(element); // Animate only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters view
    });

    animElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* =========================================================================
     * 5. PORTFOLIO GALLERY LIGHTBOX
     * ========================================================================= */
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentGalleryIndex = 0;
    const galleryImagesData = [];

    // Collect gallery images data
    galleryItems.forEach((item, index) => {
        const img = item.querySelector(".gallery-img");
        const label = item.querySelector(".gallery-label");
        
        galleryImagesData.push({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "Fade District Haircut",
            title: label ? label.textContent : "HAIRCUT STYLE"
        });

        item.addEventListener("click", () => {
            currentGalleryIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        if (!lightbox) return;
        updateLightboxContent();
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Block scrolling
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
    }

    function updateLightboxContent() {
        const currentData = galleryImagesData[currentGalleryIndex];
        if (lightboxImg && lightboxCaption) {
            lightboxImg.src = currentData.src;
            lightboxImg.alt = currentData.alt;
            lightboxCaption.textContent = currentData.title;
        }
    }

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex-1+galleryImagesData.length) % galleryImagesData.length;
            updateLightboxContent();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImagesData.length;
            updateLightboxContent();
        });
    }

    // Close lightbox on clicking backdrop area
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox and Modals
    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.classList.contains("active")) {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") {
                currentGalleryIndex = (currentGalleryIndex-1+galleryImagesData.length) % galleryImagesData.length;
                updateLightboxContent();
            }
            if (e.key === "ArrowRight") {
                currentGalleryIndex = (currentGalleryIndex + 1) % galleryImagesData.length;
                updateLightboxContent();
            }
        }
        if (bookingModal && bookingModal.classList.contains("active") && e.key === "Escape") {
            closeBookingModal();
        }
    });

    /* =========================================================================
     * 6. TESTIMONIALS SLIDER
     * ========================================================================= */
    const slides = document.querySelectorAll(".review-slide");
    const dots = document.querySelectorAll(".dot");
    const prevSlideBtn = document.getElementById("prevSlide");
    const nextSlideBtn = document.getElementById("nextSlide");
    let currentSlideIndex = 0;
    let autoSlideTimer;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        currentSlideIndex = (index + slides.length) % slides.length;
        slides[currentSlideIndex].classList.add("active");
        
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add("active");
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 6000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
        }
    }

    if (prevSlideBtn && nextSlideBtn) {
        prevSlideBtn.addEventListener("click", () => {
            showSlide(currentSlideIndex-1);
            startAutoSlide();
        });

        nextSlideBtn.addEventListener("click", () => {
            showSlide(currentSlideIndex + 1);
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    const reviewsSection = document.getElementById("reviews");
    if (reviewsSection) {
        reviewsSection.addEventListener("mouseenter", stopAutoSlide);
        reviewsSection.addEventListener("mouseleave", startAutoSlide);
    }

    startAutoSlide(); // Initialize slider rotation

    /* =========================================================================
     * 7. MULTI STEP APPOINTMENT BOOKING SYSTEM
     * ========================================================================= */
    const bookingModal = document.getElementById("bookingModal");
    const bookTriggers = document.querySelectorAll(".btn-book-trigger");
    const modalCloseBtn = document.getElementById("modalClose");
    
    const stepCards = document.querySelectorAll(".booking-step");
    const stepDots = document.querySelectorAll(".step-dot");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnFinish = document.getElementById("btnFinish");
    const modalFooterControls = document.getElementById("modalFooterControls");
    const detailsForm = document.getElementById("detailsForm");
    
    // Booking Form State Variables
    let currentStep = 1;
    let selectedService = "SKIN FADE";
    let selectedPrice = "£25";
    let selectedBarber = "JORDAN M.";
    let selectedDate = "";
    let selectedTime = "";

    // Open/Close Modal
    bookTriggers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openBookingModal();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeBookingModal);

    if (bookingModal) {
        bookingModal.addEventListener("click", (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    function openBookingModal() {
        if (!bookingModal) return;
        resetBookingForm();
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";
        generateDateCards();
    }

    function closeBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    function resetBookingForm() {
        currentStep = 1;
        selectedDate = "";
        selectedTime = "";
        
        // Reset steps UI
        goToStep(1);
        
        // Reset details form
        if (detailsForm) detailsForm.reset();
        
        // Enable nav footer buttons
        if (modalFooterControls) modalFooterControls.style.display = "flex";
        if (btnNext) {
            btnNext.textContent = "CONTINUE";
            btnNext.disabled = false;
        }
        if (btnPrev) {
            btnPrev.disabled = true;
        }
    }

    function goToStep(stepNum) {
        // Hide all steps, show active
        stepCards.forEach(card => card.classList.remove("active"));
        const activeCard = document.getElementById(`step-${stepNum}`);
        if (activeCard) activeCard.classList.add("active");

        // Update dots progress indicators
        stepDots.forEach(dot => {
            const stepIndex = parseInt(dot.getAttribute("data-step"));
            dot.classList.remove("active", "complete");
            if (stepIndex === stepNum) {
                dot.classList.add("active");
            } else if (stepIndex < stepNum) {
                dot.classList.add("complete");
            }
        });

        currentStep = stepNum;

        // Footer button states
        if (btnPrev) {
            btnPrev.disabled = (currentStep === 1);
        }

        if (btnNext) {
            if (currentStep === 4) {
                btnNext.textContent = "CONFIRM & BOOK";
            } else {
                btnNext.textContent = "CONTINUE";
            }
        }
    }

    // Modal Next/Back controls
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (currentStep > 1) {
                goToStep(currentStep-1);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                if (currentStep < 4) {
                    goToStep(currentStep + 1);
                    if (currentStep === 3) {
                        // Re-generate time slots in case date changed
                        generateTimeSlots();
                    }
                } else if (currentStep === 4) {
                    processBookingConfirmation();
                }
            }
        });
    }

    if (btnFinish) {
        btnFinish.addEventListener("click", closeBookingModal);
    }

    // Validate selections on steps before continuing
    function validateStep(step) {
        if (step === 1) {
            // Read selected service radio button
            const serviceRadio = document.querySelector('input[name="booking-service"]:checked');
            if (serviceRadio) {
                selectedService = serviceRadio.value;
                selectedPrice = serviceRadio.getAttribute("data-price");
            }
            return true;
        }
        
        if (step === 2) {
            // Read selected barber radio button
            const barberRadio = document.querySelector('input[name="booking-barber"]:checked');
            if (barberRadio) {
                selectedBarber = barberRadio.value;
            }
            return true;
        }
        
        if (step === 3) {
            // Check that date and time are both selected
            if (!selectedDate) {
                alert("Please select a date for your appointment.");
                return false;
            }
            if (!selectedTime) {
                alert("Please select a time slot for your appointment.");
                return false;
            }
            return true;
        }
        
        if (step === 4) {
            // Validate details form HTML5 validation
            if (detailsForm) {
                if (!detailsForm.checkValidity()) {
                    detailsForm.reportValidity();
                    return false;
                }
            }
            return true;
        }

        return true;
    }

    /* =========================================================================
     * Date & Time Generation Helpers (UK English Format)
     * ========================================================================= */
    const dateScrollGrid = document.getElementById("dateScrollGrid");
    const timeSlotsGrid = document.getElementById("timeSlotsGrid");

    function generateDateCards() {
        if (!dateScrollGrid) return;
        dateScrollGrid.innerHTML = "";
        
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + i);
            
            const dayName = daysOfWeek[currentDate.getDay()];
            const dayNum = currentDate.getDate();
            const monthName = months[currentDate.getMonth()];
            const fullDateString = `${dayName} ${dayNum} ${monthName}`;

            const dateCard = document.createElement("div");
            dateCard.className = "date-card";
            if (i === 0 && !selectedDate) {
                dateCard.classList.add("active");
                selectedDate = fullDateString;
            } else if (selectedDate === fullDateString) {
                dateCard.classList.add("active");
            }
            
            dateCard.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="day-num">${dayNum}</span>
            `;

            dateCard.addEventListener("click", () => {
                document.querySelectorAll(".date-card").forEach(c => c.classList.remove("active"));
                dateCard.classList.add("active");
                selectedDate = fullDateString;
                
                // Re-evaluate time slots based on day limits (e.g. Sunday shorter hours)
                selectedTime = ""; // Reset chosen time
                generateTimeSlots();
            });

            dateScrollGrid.appendChild(dateCard);
        }
    }

    function generateTimeSlots() {
        if (!timeSlotsGrid) return;
        timeSlotsGrid.innerHTML = "";

        // Check if selected date is a Sunday
        // We parse day name from selectedDate string (starts with day name like "Sun")
        const isSunday = selectedDate.startsWith("Sun");
        const startHour = 10;
        const endHour = isSunday ? 16 : (selectedDate.startsWith("Thu") || selectedDate.startsWith("Fri") ? 20 : 19);

        // Generate time slots hourly
        for (let h = startHour; h < endHour; h++) {
            const timeString = `${h.toString().padStart(2, '0')}:00`;
            
            const timeSlotBtn = document.createElement("div");
            timeSlotBtn.className = "time-slot";
            if (selectedTime === timeString) {
                timeSlotBtn.classList.add("active");
            }
            
            timeSlotBtn.textContent = timeString;
            timeSlotBtn.addEventListener("click", () => {
                document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("active"));
                timeSlotBtn.classList.add("active");
                selectedTime = timeString;
            });

            timeSlotsGrid.appendChild(timeSlotBtn);
        }
    }

    /* =========================================================================
     * Booking confirmation processing
     * ========================================================================= */
    const bookingReceipt = document.getElementById("bookingReceipt");

    function processBookingConfirmation() {
        const nameInput = document.getElementById("cust-name");
        const emailInput = document.getElementById("cust-email");
        const phoneInput = document.getElementById("cust-phone");
        const notesInput = document.getElementById("cust-notes");

        const customerName = nameInput ? nameInput.value : "";
        const customerEmail = emailInput ? emailInput.value : "";
        const customerPhone = phoneInput ? phoneInput.value : "";
        const customerNotes = notesInput ? notesInput.value : "";

        // Generate random Booking ID
        const bookingId = "FD" + Math.floor(10000 + Math.random() * 90000);

        // Create booking object
        const bookingData = {
            id: bookingId,
            service: selectedService,
            price: selectedPrice,
            barber: selectedBarber,
            date: selectedDate,
            time: selectedTime,
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                notes: customerNotes
            },
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        saveBookingToLocal(bookingData);

        // Fill receipt HTML layout
        if (bookingReceipt) {
            bookingReceipt.innerHTML = `
                <div class="receipt-row">
                    <span class="label">Booking Reference</span>
                    <span class="value gold">${bookingId}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Service</span>
                    <span class="value">${selectedService}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Barber Specialist</span>
                    <span class="value">${selectedBarber}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Appointment Time</span>
                    <span class="value">${selectedDate} at ${selectedTime}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Client Name</span>
                    <span class="value">${customerName}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Service Cost</span>
                    <span class="value gold">${selectedPrice}</span>
                </div>
            `;
        }

        // Move to step 5 (success)
        goToStep(5);
        
        // Hide navigation footer controls since booking is completed
        if (modalFooterControls) {
            modalFooterControls.style.display = "none";
        }
    }

    function saveBookingToLocal(newBooking) {
        try {
            const existingBookingsJSON = localStorage.getItem("fade_district_bookings");
            const bookingsList = existingBookingsJSON ? JSON.parse(existingBookingsJSON) : [];
            bookingsList.push(newBooking);
            localStorage.setItem("fade_district_bookings", JSON.stringify(bookingsList));
        } catch (e) {
            console.error("Local storage booking saving error: ", e);
        }
    }
});
