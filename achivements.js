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
  const check 