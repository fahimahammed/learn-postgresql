(function () {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 0) {
      btn.style.display = "flex";
      requestAnimationFrame(() => {
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      });
    } else {
      btn.style.opacity = "0";
      btn.style.transform = "translateY(10px)";
      setTimeout(() => {
        if (window.scrollY === 0) btn.style.display = "none";
      }, 300);
    }
  };

  const scrollToTop = (e) => {
    e && e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  btn.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  window.addEventListener("resize", toggleVisibility);
  toggleVisibility();
})();
