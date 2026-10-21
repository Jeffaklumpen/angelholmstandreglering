# Ängelholms Tandreglering – ny webbplats

En första ny version av **[Ängelholms Tandreglering](https://www.angelholmstandreglering.se/)** med en modern, mobilanpassad design. Projektet är byggt med **HTML, CSS och JavaScript**, utan Astro eller andra ramverk.

## Förhandsvisa med GitHub Pages

1. Öppna repositoryt i GitHub och gå till **Settings → Pages**.
2. Under **Build and deployment**, välj **Deploy from a branch**.
3. Välj **main** och **/(root)**, klicka **Save**.
4. När publiceringen har slutförts hittar du förhandsvisningen under:

   https://jeffaklumpen.github.io/angelholmstandreglering/

**Viktigt:** GitHub Pages måste aktiveras i Settings innan länken fungerar. Det publika repositoryt i sig aktiverar inte en webbplats automatiskt.

## Sidor

- `index.html` – startsidan
- `tandreglering/index.html` – tandställning
- `invisalign/index.html` – Invisalign
- `tandblekning/index.html` – tandblekning
- `galleri/index.html` – galleri
- `blogg/index.html` – bloggöversikt (artiklarna öppnas tillfälligt hos Wix)
- `om-oss/index.html` – om kliniken och personalen
- `boka-tid/index.html` – information och länk till befintligt bokningsformulär
- `integritetspolicy/index.html` – ofullständigt utkast, **inte redo att publicera som slutlig policy**

Gemensamma resurser: `css/styles.css`, `js/main.js`, `bilder/`.

## Status

✅ Responsiv första designversion med befintliga bilder  
✅ Befintliga huvudsidors URL-sökvägar representerade som mappar med index.html  
✅ Navigering, kontaktsektioner och mobilmeny  
✅ Sidtitlar och metabeskrivningar som utkast  
✅ Bokningsflöde länkar till nuvarande Wix-sida under utvecklingen

### Måste lösas före lansering hos Wix

- [ ] Godkänn design, text, öppettider, personaluppgifter och medicinska formuleringar.
- [ ] Koppla redigerbara texter och bilder till **Wix CMS**.
- [ ] Integrera **Wix Blog** för publicering och redigering av blogginlägg.
- [ ] Bevara och migrera gamla blogginlägg, kategorier, bilder och deras URL:er (t.ex. `/post/...`).
- [ ] Säkerställ verkligt boknings-/kontaktformulär, kryptering och hantering av patientuppgifter. På förhandsversionen går bokningsformuläret till gamla Wix-sidan.
- [ ] Färdigställ och juridiskt granska integritetspolicyn.
- [ ] Granska vilka kliniska och ekonomiska påståenden som fortfarande är aktuella, exempelvis väntetid och betalningsgaranti.
- [ ] Granska SEO, tillgänglighet, sidprestanda, kanoniska adresser och eventuella 301-omdirigeringar.
- [ ] **Ta bort `noindex,nofollow` från alla sidor när den nya domänen lanseras.** Under utvecklingen är detta avsiktligt för att undvika duplicerat indexerat innehåll.
- [ ] Testa att Wix Headless kan hosta och servera den valda statiska strukturen och att CMS-innehåll uppdateras utan kodändringar.
- [ ] Spara en offline-kopia av källkoden innan GitHub-repositoryt eventuellt tas bort.

## Viktigt

Ändringar här påverkar inte den nuvarande hemsidan på Wix. Lägg inte upp patientuppgifter, privata nycklar eller andra hemligheter i repositoryt. En publik GitHub Pages-sida är bara en **öppen förhandsvisning**, inte ett säkert system för patientkommunikation.
