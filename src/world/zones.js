export const WORLD_ZONES = [
  {
    id: "station",
    label: "Участок",
    sceneId: 1,
    description: "Шериф Бартон ждёт тебя с полароидом Дэнни.",
    position: 5,
    tone: "#0b1224"
  },
  {
    id: "gas",
    label: "Старая заправка",
    sceneId: 2,
    description: "Стёртая вывеска и тихий хозяин, который видел мальчика.",
    position: 30,
    tone: "#111827"
  },
  {
    id: "harper",
    label: "Дом Харперов",
    sceneId: 3,
    description: "Родители Дэнни показывают его комнату и находят улики.",
    position: 50,
    tone: "#0f172a"
  },
  {
    id: "station-return",
    label: "Участок (отчёт)",
    sceneId: 4,
    description: "Ты возвращаешься с уликами и обсуждаешь прогресс с шерифом.",
    position: 60,
    tone: "#0c1324"
  },
  {
    id: "factory",
    label: "Заброшенный завод",
    sceneId: 5,
    description: "Гул металла и слухи о криптиде в тоннелях.",
    position: 70,
    tone: "#0b1224"
  },
  {
    id: "finale",
    label: "Развязка",
    sceneId: 6,
    description: "Финал расследования и последний выбор.",
    position: 90,
    tone: "#0a0f1f"
  }
];

export function getZoneIndexByScene(sceneId) {
  const idx = WORLD_ZONES.findIndex((z) => z.sceneId === sceneId);
  return idx === -1 ? 0 : idx;
}
