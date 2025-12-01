export const WORLD_ZONES = [
  {
    id: "station",
    label: "Участок",
    sceneId: 1,
    description: "Шериф Бартон ждёт тебя с полароидом Дэнни.",
    position: 5,
    tone: "#0b1224",
    backdrop: "/assets/valiant/bg-station.svg",
    scoutReward: {
      text: "Ты подбираешь смятый отчёт о пропаже Дэнни",
      points: 5,
      investigation: 1,
      item: "Смятый рапорт"
    }
  },
  {
    id: "gas",
    label: "Старая заправка",
    sceneId: 2,
    description: "Стёртая вывеска и тихий хозяин, который видел мальчика.",
    position: 30,
    tone: "#111827",
    backdrop: "/assets/valiant/bg-gas.svg",
    scoutReward: {
      text: "В мусорке — клочок карты с отметкой",
      points: 7,
      investigation: 2,
      item: "Отметка с заправки"
    }
  },
  {
    id: "harper",
    label: "Дом Харперов",
    sceneId: 3,
    description: "Родители Дэнни показывают его комнату и находят улики.",
    position: 50,
    tone: "#0f172a",
    backdrop: "/assets/valiant/bg-home.svg",
    scoutReward: {
      text: "В подвале — коробка с плёнками Дэнни",
      points: 9,
      investigation: 2,
      item: "Коробка с плёнками"
    }
  },
  {
    id: "station-return",
    label: "Участок (отчёт)",
    sceneId: 4,
    description: "Ты возвращаешься с уликами и обсуждаешь прогресс с шерифом.",
    position: 60,
    tone: "#0c1324",
    backdrop: "/assets/valiant/bg-station.svg",
    scoutReward: {
      text: "В хранилище — потерянный диктофон",
      points: 6,
      investigation: 1,
      item: "Диктофон"
    }
  },
  {
    id: "factory",
    label: "Заброшенный завод",
    sceneId: 5,
    description: "Гул металла и слухи о криптиде в тоннелях.",
    position: 70,
    tone: "#0b1224",
    backdrop: "/assets/valiant/bg-factory.svg",
    scoutReward: {
      text: "На полу — ржавый пропуск с логотипом SILENCER",
      points: 12,
      investigation: 3,
      fear: 1,
      item: "Ржавый пропуск"
    }
  },
  {
    id: "finale",
    label: "Развязка",
    sceneId: 6,
    description: "Финал расследования и последний выбор.",
    position: 90,
    tone: "#0a0f1f",
    backdrop: "/assets/valiant/bg-finale.svg",
    scoutReward: {
      text: "У кромки леса блестит серебристая чешуя",
      points: 15,
      investigation: 4,
      fear: 2,
      item: "Серебристая чешуя"
    }
  }
];

export function getZoneIndexByScene(sceneId) {
  const idx = WORLD_ZONES.findIndex((z) => z.sceneId === sceneId);
  return idx === -1 ? 0 : idx;
}
