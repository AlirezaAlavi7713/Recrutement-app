export const formatDate = (date) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString("fr-FR");

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return formatDateShort(date);
};
