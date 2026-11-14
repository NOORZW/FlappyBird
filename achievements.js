/* Example Flappy add-on. Rename to achievements.js (next to flappy.html) to activate.
   Shows the whole API: events, stats, toasts, a title-screen button, an overlay panel, skin locks. */
(() => {
  const F = window.Flappy, { spr, text, panel, rect } = F.px;

  const LIST = [
    { id: "first",  name: "First Flap",  desc: "Flap once",          test: (d, F) => F.stats.flaps >= 1 },
    { id: "ten",    name: "Double Digits", desc: "Score 10 in a run", test: (d) => d.score >= 10 },
    { id: "coins5", name: "Coin Hoarder", desc: "Collect 5 coins ever", test: (d, F) => F.stats.coins >= 5 },
    { id: "night",  name: "Night Owl",   desc: "Reach the night sky", test: (d) => d.phase === 2 },
  ];
  const have = new Set(F.store.get("done", []));
  const trophy = spr(["#######", ".#####.", ".#####.", "..###..", "...#...", "..###.."].map(r => r.replace(/#/g, "y")), { y: "#d99a10" });

  function unlock(a) {
    if (have.has(a.id)) return;
    have.add(a.id); F.store.set("done", [...have]);
    F.toast({ title: "ACHIEVEMENT", text: a.name, icon: trophy });
    F.beep(988, 0.12, "triangle", 0.07); F.beep(1318, 0.2, "triangle", 0.07, 0, 0.1);
    if (a.id === "ten") F.unlockSkin(3);
  }
  const check = (d) => LIST.forEach(a => { if (!have.has(a.id) && a.test(d || {}, F)) unlock(a); });

  F.lockSkin(3, "Score 10 to unlock");           // gate the Mint bird behind an achievement
  if (have.has("ten")) F.unlockSkin(3);

  F.on("flap", check).on("score", check).on("phase", check).on("death", check);

  F.addButton({
    id: "ach",
    draw(api, x, y) { api.ctx.drawImage(trophy, x + 8, y + 10, 28, 24); },
    onClick() {
      F.setOverlay({
        draw(api) {
          const c = api.ctx; c.fillStyle = "rgba(0,0,0,.6)"; c.fillRect(0, 0, 480, 640);
          panel(40, 80, 400, 480);
          text("ACHIEVEMENTS", 240, 100, 3, "#c0410f");
          LIST.forEach((a, i) => {
            const ok = have.has(a.id), y = 160 + i * 80;
            text(a.name, 70, y, 2, ok ? "#2a7a2a" : "#8a7a4a", "left");
            text(a.desc, 70, y + 28, 1, "#5a4a1a", "left");
          });
          text("TAP TO CLOSE", 240, 520, 1, "#5a4a1a");
        },
        pointer() { F.setOverlay(null); },
        key(e) { if (e.key === "Escape") F.setOverlay(null); },
      });
    },
  });
})();