 <script>
        // Initialize Lucide Vector Icons on load
        lucide.createIcons();

        // Mobile Responsive Navigation View Controller System
        const burgerToggle = document.getElementById('burgerToggle');
        const navMenu = document.getElementById('navMenu');

        burgerToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle Burger Icon State variation between Menu and X for visual Polish
            const icon = burgerToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Interactive Highlight Handler for standard navigation anchors
        function setActiveLink(clickedLink) {
            // Remove active color layout state class from all anchors
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => link.classList.remove('active'));
            
            // Apply active accent state color to the target selection
            clickedLink.classList.add('active');

            // Autoclose navigation drawer window stack on mobile selections seamlessly
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                burgerToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }

        // Contact Client Submission Interceptor System
        function handleFormSubmit(event) {
            event.preventDefault();
            alert('Thank you for reaching out! Your reservation message has been delivered to Oppo Billiard Hall management.');
            event.target.reset();
        }

        // Simple Window Scroll Tracker to update Nav highlighting implicitly 
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('header, section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSectionId = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    </script>