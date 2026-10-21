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


  // Uppdateringar på startsidan. Text skrivs säkert med textContent.
  const clinicNewsFeed = document.querySelector("#clinic-news-feed[data-news-source]");
  if (clinicNewsFeed) {
    const renderNews = async () => {
      try {
        const response = await fetch(clinicNewsFeed.dataset.newsSource, { cache: "no-store" });
        if (!response.ok) throw new Error("News not available");
        const data = await response.json();
        if (!Array.isArray(data.updates)) throw new Error("Invalid news list");
        const news = data.updates
          .filter(item => item && item.active !== false && typeof item.title === "string" &&
            item.title.trim() && typeof item.text === "string" && item.text.trim())
          .sort((a, b) => {
            if (!!a.important !== !!b.important) return a.important ? -1 : 1;
            return String(b.date || "").localeCompare(String(a.date || ""));
          })
          .slice(0, 5);
        if (!news.length) return;
        const fragment = document.createDocumentFragment();
        for (const item of news) {
          const article = document.createElement("article");
          article.className = "clinic-news-item";
          const meta = document.createElement("div");
          meta.className = "clinic-news-meta";
          if (item.important) {
            const tag = document.createElement("span");
            tag.className = "clinic-news-important";
            tag.textContent = "Viktigt";
            meta.appendChild(tag);
          }
          if (typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
            const date = new Date(item.date + "T12:00:00");
            if (!Number.isNaN(date.getTime())) {
              const time = document.createElement("time");
              time.dateTime = item.date;
              time.textContent = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(date);
              meta.appendChild(time);
            }
          }
          const heading = document.createElement("h3");
          heading.textContent = item.title;
          const text = document.createElement("p");
          text.textContent = item.text;
          if (meta.childNodes.length) article.appendChild(meta);
          article.append(heading, text);
          fragment.appendChild(article);
        }
        clinicNewsFeed.replaceChildren(fragment);
      } catch (error) {
        // Om källan är otillgänglig visas befintligt tomtillstånd i HTML.
        console.warn("Kunde inte ladda kliniknyheter.", error);
      }
    };
    renderNews();
  }

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