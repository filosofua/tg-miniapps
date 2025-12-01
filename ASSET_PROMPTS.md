# Арт-пак для "Ashwood, Oregon. 1976"

Подборка готовых подсказок (prompts) для генеративных моделей, чтобы быстро собрать консистентные ассеты в стиле dark retro comic noir под мобильный Telegram Mini App.

## Общие настройки генератора
- Стиль: "dark retro comic noir, 1970s america, fog, film grain, muted neon".
- Формат: вертикальный 9:16 либо квадрат 1:1 для NFT. PNG/WebP, прозрачный фон для персонажей/UI.
- Детализация: medium-high, без гиперреализма; лёгкий растр/зерно.
- Seed: зафиксируйте seed для серии, чтобы ассеты совпадали по цветам и освещению.

## Фоны (backgrounds)
Используйте 1440x2560 или 1080x1920. Добавьте небольшой параллакс (отдельные слои, если позволяет генератор).

1. **Город (town/night):**
   - Prompt: "dusty small town main street, oregon 1976, neon signs half lit, fog rolling, film grain, comic noir panel, wide shot, empty road, overhead power lines".
   - Variант днём: замените neon на "overcast day, washed colors".

2. **Кабинет шефа (police office):**
   - Prompt: "1970s police chief office, wood panels, blinds casting stripes, desk lamp, rotary phone, corkboard with pins, cigarette smoke, noir comic frame".

3. **Дом Харперов (suburbs house):**
   - Prompt: "quiet suburban house 1970s oregon, front porch light, autumn trees, mist, driveway with old sedan, comic noir atmosphere".

4. **Заправка (gas station):**
   - Prompt: "lonely 1970s gas station at night, fluorescent light, wet asphalt reflections, forest background, eerie calm, film grain, comic panel".

5. **Заброшенный завод (factory):**
   - Prompt: "abandoned lumber mill, broken windows, hanging chains, foggy night, moonlit silhouettes, tense atmosphere, retro comic texture".

6. **Монстр/криптид (silhouette):**
   - Prompt: "cryptid silhouette behind industrial pipes, glowing eyes faint, heavy fog, backlight, 1970s horror comic minimal reveal".

## Персонажи и NFT-детективы
Размер 1024x1024, прозрачный фон. Укажите позу по пояс.

- Общий промт: "portrait of a 1970s detective, ashwood oregon, waist-up, trench coat, subtle neon rim light, film grain, comic ink outlines, transparent background".
- Вариации по редкости:
  - **common:** "simple outfit, muted browns, calm expression".
  - **rare:** "vivid accent color scarf, stronger rim light, confident stance".
  - **legendary:** "dramatic lighting, rare color palette teal-magenta, badge glint, cinematic shadows".
- Сохраняйте имена файлов как `det_001.png`, `det_002.png`, … для стартового пула (`src/nft/nftPool.json`).

## Финальные NFT
Тоже 1024x1024 с прозрачным фоном.
- Prompt: "mysterious artifact badge from ashwood case, 1970s occult device, brass and neon, floating, comic noir render, transparent background".
- Сохранение имён: `ending_001.png`, `ending_002.png`, … и добавление в `src/nft/endingNftPool.json`.

## UI-элементы
1. **Комикс-панель / диалоговое облако:**
   - Prompt: "comic speech bubble frame, rough ink edges, slight halftone fill, transparent background, noir style".
2. **Кнопки выбора:**
   - Prompt: "pill shaped button, dark navy with neon cyan edge, subtle grain, flat light, transparent".
3. **HUD/бейдж статуса:**
   - Prompt: "small badge icon, retro police shield, minimal, neon outline, transparent".

## Советы по унификации
- Используйте одну цветовую палитру: глубокий индиго (#0c1524), тёплый янтарь (#c48a3a), приглушённый бирюзовый (#3e8ea3), кремовый (#d7c9a3).
- После генерации сделайте лёгкий `add grain / vignette` в редакторе, чтобы сблизить ассеты по фактуре.
- Если модель даёт слишком современный вид, добавьте "analog photography, 35mm, vintage" в prompt.

## Куда класть файлы
- Фоны: `public/assets/images/{city,police,home,gas,factory,monster}.png`.
- NFT старт: `public/assets/images/det_*.png`.
- NFT финал: `public/assets/images/ending_*.png`.
- UI-элементы: `public/assets/ui/*.png` (обновите импорты при использовании).

## Как подключить
1. Скопируйте готовые файлы в `public/assets/...`.
2. В `src/nft/nftPool.json` и `src/nft/endingNftPool.json` укажите пути до картинок.
3. В компонентах, где нужны фоны, импортируйте из `public` по относительным путям (пример: `/assets/images/city.png`).
4. Прогоните `npm run build` для проверки путей и размера бандла.

