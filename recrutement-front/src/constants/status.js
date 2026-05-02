import { FaHourglass, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { createElement } from "react";

export const STATUTS = ["en_attente", "vue", "acceptee", "refusee"];

export const STATUS_CONFIG = {
  en_attente: { label: "En attente", icon: createElement(FaHourglass), badge: "badge-muted", color: "#94a3b8" },
  vue:        { label: "Vue",         icon: createElement(FaEye),         badge: "badge-cyan",    color: "#06b6d4" },
  acceptee:   { label: "Acceptée",    icon: createElement(FaCheckCircle), badge: "badge-success", color: "#10b981" },
  refusee:    { label: "Refusée",     icon: createElement(FaTimesCircle), badge: "badge-danger",  color: "#ef4444" },
};

export const CONTRATS = ["CDI", "CDD", "Stage", "Alternance", "Freelance"];
export const DOMAINES = ["Informatique", "Marketing", "Finance", "RH", "Commerce", "Santé", "Design", "Autre"];
