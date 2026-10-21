(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");
  const dropdown = document.querySelector(".nav-dropdown");
  const trigger = dropdown?.querySelector(".nav-dropdown-trigger");
  const submenu = dropdown?.querySelector(".nav-submenu");
  const desktop = window.matchMedia("(min-width: 801px)");

  function closeDropdown() {
    if (!dropdown || !trigger) return;
    dropdown.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    if (!dropdown || !trigger) return;
    dropdown.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!navigation || !menuButton) return;
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Öppna menyn");
    closeDropdown();
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      navigation.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Stäng menyn" : "Öppna menyn");
      if (!open) closeDropdown();
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  if (dropdown && trigger && submenu) {
    trigger.addEventListener("click", () => {
      if (trigger.getAttribute("aria-expanded") === "true") {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // On desktop, hovering the label opens the submenu without navigation.
    dropdown.addEventListener("pointerenter", event => {
      if (desktop.matches && event.pointerType !== "touch") openDropdown();
    });
    dropdown.addEventListener("pointerleave", event => {
      if (desktop.matches && event.pointerType !== "touch") closeDropdown();
    });

    dropdown.addEventListener("focusout", event => {
      if (!dropdown.contains(event.relatedTarget)) closeDropdown();
    });

    desktop.addEventListener("change", () => {
      closeMenu();
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (dropdown?.classList.contains("is-open")) {
      closeDropdown();
      trigger.focus();
    } else if (navigation?.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  const filters = document.querySelectorAll("[data-blog-filter]");
  const posts = document.querySelectorAll("[data-blog-category]");
  filters.forEach(button => button.addEventListener("click", () => {
    const selected = button.dataset.blogFilter;
    filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    posts.forEach(post => { post.hidden = selected !== "alla" && post.dataset.blogCategory !== selected; });
  }));
})();