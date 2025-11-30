const scene3 = {
  id: 'scene3',
  title: 'Заправка у трассы',
  background: 'gas',
  steps: [
    { type: 'dialogue', speaker: 'Сторож на заправке', text: 'Слышал мотор часа в два ночи. Потом — тишина и запах озона.' },
    {
      type: 'choice',
      text: 'Что спрашиваешь?',
      options: [
        { label: 'Показать фото Томми', investigation: 1, next: 3 },
        { label: 'Спросить про свет', fear: 1, next: 3 },
        { label: 'Записать номер пикапа', investigation: 1, moral: 1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Сторож на заправке', text: 'Пикап ушёл к заброшенному заводу. Там сейчас никого не бывает... кроме шорохов.' },
    { type: 'add_item', item: 'Номер пикапа', next: 5 },
    { type: 'goto', target: 'scene4' },
  ],
};

export default scene3;
