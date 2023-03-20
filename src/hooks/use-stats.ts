import { useMemo } from "react";
import Stats from "stats.js";

type STATS_OPTIONS = "fps" | "ms";

const StatsOptionMapper: {
  [K in STATS_OPTIONS]: number;
} = {
  fps: 0,
  ms: 1,
};

export const useStats = (statOption: STATS_OPTIONS) => {
  const stats = useMemo(() => {
    if (typeof window == "undefined") return null;
    return new Stats();
  }, []);

  const setupStats = (insertIntoDom: HTMLElement) => {
    stats?.showPanel(StatsOptionMapper[statOption]);
    stats && insertIntoDom.appendChild(stats.dom);
  };
  return { stats, setupStats };
};
