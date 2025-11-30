import { useState } from "react";

export default function SceneRenderer({ sceneData, onNextScene, updatePlayer }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = sceneData.steps[stepIndex];

  function next(optionIndex = null) {
    // если это выбор
    if (optionIndex !== null) {
      const option = step.options[optionIndex];

      if (option.fear) updatePlayer("fear", option.fear);
      if (option.investigation) updatePlayer("investigation", option.investigation);
      if (option.item) updatePlayer("inventory", option.item);

      if (option.nextScene) {
        onNextScene(option.nextScene);
        setStepIndex(0);
        return;
      }

      if (typeof option.next === "number") {
        setStepIndex(option.next);
        return;
      }
    } else {
      // обычный переход
      if (step.nextScene) {
        onNextScene(step.nextScene);
        setStepIndex(0);
        return;
      }
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{sceneData.title}</h2>

      {step.type === "dialogue" && (
        <div>
          <p style={{ marginBottom: 12 }}>
            <b>{step.character}:</b> {step.text}
          </p>
          <button onClick={() => next()}>Далее</button>
        </div>
      )}

      {step.type === "choice" && (
        <div>
          <p style={{ marginBottom: 12 }}>{step.text}</p>
          {step.options.map((o, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <button onClick={() => next(i)}>{o.label}</button>
            </div>
          ))}
        </div>
      )}

      {step.type === "add_item" && (
        <div>
          <p style={{ marginBottom: 12 }}>
            Вы получили: <b>{step.item}</b>
          </p>
          <button onClick={() => next()}>Далее</button>
        </div>
      )}
    </div>
  );
}
