import { useEffect } from 'react';

const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -50px 0px', threshold: 0 }
        );

        const observeNew = () => {
            document.querySelectorAll('.reveal-on-scroll:not(.active)').forEach((el) => {
                observer.observe(el);
            });
        };

        // Observe elements already in DOM
        observeNew();

        // Watch for elements added by lazy-loaded components (Suspense)
        const mutationObserver = new MutationObserver(observeNew);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
};

export default useScrollReveal;
