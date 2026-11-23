// Menu do telemóvel.
export function initMenu() {
  const nav = document.getElementById("nav"), mb = document.getElementById("menu");
  mb.onclick = () => mb.setAttribute("aria-expanded", nav.classList.toggle("open"));
  nav.onclick = (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }
  };
}
