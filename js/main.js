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


  // Formuläret kan användas när en säker serverendpoint (t.ex. Wix Forms-integration)
  // har kopplats in. GitHub Pages kan inte skicka e-post direkt.
  document.querySelectorAll("[data-contact-form]").forEach(form => {
    const submit = form.querySelector("button[type=submit]");
    const status = form.querySelector("[data-form-status]");
    const endpoint = form.getAttribute("data-endpoint")?.trim() || "";
    const active = endpoint.startsWith("https://");
    if (!active) {
      submit.disabled = true;
      status.textContent = "Förhandsvisning: Formuläret är inte aktiverat ännu. Ring eller mejla oss tills kopplingen till Wix är klar.";
      return;
    }
    submit.disabled = false;
    status.textContent = "";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get("website")) return; // Enkel botfälla
      submit.disabled = true;
      status.textContent = "Skickar ditt meddelande...";
      status.className = "form-status";
      try {
        const payload = {
          firstName: String(data.get("firstName") || "").trim(),
          lastName: String(data.get("lastName") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          email: String(data.get("email") || "").trim(),
          message: String(data.get("message") || "").trim()
        };
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Submission failed");
        status.textContent = "Tack! Ditt meddelande har skickats.";
        status.className = "form-status success";
        form.reset();
      } catch {
        status.textContent = "Det gick inte att skicka meddelandet. Kontakta oss via telefon eller e-post i stället.";
        status.className = "form-status error";
      } finally {
        submit.disabled = false;
      }
    });
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