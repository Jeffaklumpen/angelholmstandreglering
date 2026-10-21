(() => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navigation");
  if (button && nav) {
    const close = () => { nav.classList.remove("open"); button.setAttribute("aria-expanded","false"); button.setAttribute("aria-label","Öppna menyn"); };
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("open",open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label",open?"Stäng menyn":"Öppna menyn");
    });
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
    document.addEventListener("keydown", e=>{if(e.key==="Escape" && nav.classList.contains("open")){close();button.focus();}});
    document.addEventListener("click", e=>{if(!nav.contains(e.target)&&!button.contains(e.target))close();});
  }
  document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
  const filters = document.querySelectorAll("[data-blog-filter]");
  const posts = document.querySelectorAll("[data-blog-category]");
  filters.forEach(btn=>btn.addEventListener("click",()=>{
    const filter=btn.dataset.blogFilter;
    filters.forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));
    posts.forEach(p=>p.hidden=(filter!=="alla"&&p.dataset.blogCategory!==filter));
  }));
})();