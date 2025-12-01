// src/scenes/scene1.js

const scene1 = {
  id: 1,
  title: "Добро пожаловать в Ашвуд",
  steps: [
    {
      type: "dialogue",
      character: "Нарратор",
      text: "Орегон. 1976 год. Маленький городок Ашвуд. Здесь пропал подросток."
    },
    {
      type: "dialogue",
      character: "Шериф Бартон",
      text: "Ты детектив? Хорошо. У нас неприятности. Пропал мальчик, Дэнни Харпер."
    },
    {
      type: "choice",
      text: "Как ответишь?",
      options: [
        {
          label: "Спокойно: «Я найду его»",
          fear: -1,
          investigation: 1,
          minPoints: 3,
          maxPoints: 7,
          next: 3
        },
        {
          label: "Жёстко: «Почему вы сами не ищете?»",
          fear: 1,
          investigation: 0,
          minPoints: 1,
          maxPoints: 4,
          next: 3
        }
      ]
    },
    {
      type: "dialogue",
      character: "Нарратор",
      text: "Шериф вручает тебе полароид с последним фото мальчика."
    },
    {
      type: "add_item",
      item: "Полароид Дэнни",
      next: 5
    },
    {
      type: "dialogue",
      character: "Шериф",
      text: "Его видели в районе старой заправки. Там живёт один... странный человек."
    },
    {
      type: "choice",
      text: "Первый след ведёт к заправке. Как выезжаешь?",
      options: [
        {
          label: "Спокойно, отметив на карте дом Харперов на потом",
          minPoints: 2,
          maxPoints: 5,
          nextScene: 2
        },
        {
          label: "Срочно, пока Билл Хиггс не ушёл домой",
          minPoints: 2,
          maxPoints: 6,
          nextScene: 2
        }
      ]
    }
  ]
};

export default scene1;
