// src/scenes/scene2.js

const scene2 = {
  id: 2,
  title: "Старая заправка Ashwood Gas",
  steps: [
    {
      type: "dialogue",
      character: "Нарратор",
      text: "К закату ты подъезжаешь к старой заправке на окраине Ашвуда. Выцветившая вывеска 'Ashwood Gas' поскрипывает на ветру."
    },
    {
      type: "dialogue",
      character: "Нарратор",
      text: "Во дворе — одинокий пикап, шланги для бензина свернуты, внутри киоска горит тусклый жёлтый свет."
    },
    {
      type: "dialogue",
      character: "Билл Хиггс",
      text: "Заправка закрыта. Если за бензином — приходи утром."
    },
    {
      type: "choice",
      text: "Как представишься?",
      options: [
        {
          label: "Вежливо: 'Я детектив, расследую пропажу мальчика.'",
          fear: -1,
          investigation: 1,
          minPoints: 3,
          maxPoints: 7,
          next: 4
        },
        {
          label: "Жёстко: 'Открой дверь, у меня вопросы.'",
          fear: 1,
          investigation: 0,
          minPoints: 1,
          maxPoints: 4,
          next: 4
        }
      ]
    },
    {
      type: "dialogue",
      character: "Билл Хиггс",
      text: "Опять этот мальчишка... Я говорил, что нечего детям шататься тут вечером."
    },
    {
      type: "dialogue",
      character: "Билл Хиггс",
      text: "Он приходил вчера с друзьями. Крутились вокруг колонки, потом ушли к лесной дороге."
    },
    {
      type: "choice",
      text: "Что спросишь у Билла?",
      options: [
        {
          label: "Спросить о друзьях Дэнни",
          investigation: 1,
          minPoints: 2,
          maxPoints: 6,
          next: 7
        },
        {
          label: "Спросить о лесной дороге",
          investigation: 1,
          minPoints: 2,
          maxPoints: 6,
          next: 8
        }
      ]
    },
    {
      type: "dialogue",
      character: "Билл Хиггс",
      text: "Друзья у него странные. Один в армейской куртке, другой всё время шептался. Не понравились мне."
    },
    {
      type: "dialogue",
      character: "Билл Хиггс",
      text: "Лесная дорога уходит к старому заводу. Там давно всё закрыто. Но по ночам оттуда слышно... шум."
    },
    {
      type: "add_item",
      item: "Черновой план местности у заправки",
      next: 10
    },
    {
      type: "dialogue",
      character: "Нарратор",
      text: "Ты наспех чертишь схему окрестностей: заправка, лесная дорога, направление к заводу и дом Харперов."
    },
    {
      type: "choice",
      text: "Что дальше?",
      options: [
        {
          label: "Вернуться в участок и обдумать услышанное",
          minPoints: 2,
          maxPoints: 5,
          nextScene: 1
        },
        {
          label: "Ехать к дому Харперов",
          minPoints: 2,
          maxPoints: 5,
          nextScene: 3
        }
      ]
    }
  ]
};

export default scene2;
