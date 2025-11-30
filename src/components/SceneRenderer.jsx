import React, { useEffect, useMemo, useState } from 'react';
import { images } from '../assets/images';
import DialogueBox from './DialogueBox';
import ChoiceButtons from './ChoiceButtons';

const SceneRenderer = ({ scene, onUpdateStats, onNextScene, onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [scene?.id]);

  const current = useMemo(() => scene?.steps?.[step] || null, [scene, step]);
  const background = useMemo(() => images[scene?.background] || images.city, [scene]);

  useEffect(() => {
    if (!current) return;
    if (current.type === 'goto' && current.target) {
      onNextScene(current.target);
    }
    if (current.type === 'end') {
      onFinish(current.label || 'Финал');
    }
    if (current.type === 'add_item') {
      onUpdateStats({ item: current.item });
      setStep((prev) => Math.min((current.next ?? prev + 1), scene.steps.length - 1));
    }
  }, [current, onFinish, onNextScene, onUpdateStats, scene?.steps?.length]);

  if (!scene || !current) return null;

  const handleNext = (nextIndex = step + 1) => setStep(Math.min(nextIndex, scene.steps.length - 1));

  const handleChoice = (option) => {
    onUpdateStats({
      fear: option.fear || 0,
      investigation: option.investigation || 0,
      moral: option.moral || 0,
      item: option.item,
    });
    if (option.nextScene) {
      onNextScene(option.nextScene);
      return;
    }
    handleNext(option.next ?? step + 1);
  };

  const renderStep = () => {
    switch (current.type) {
      case 'dialogue':
        return (
          <DialogueBox
            speaker={current.speaker}
            text={current.text}
            onNext={() => handleNext()}
            accent="#f97316"
          />
        );
      case 'choice':
        return <ChoiceButtons text={current.text} options={current.options || []} onSelect={handleChoice} />;
      default:
        return null;
    }
  };

  return (
    <div className="scene-shell" style={{ backgroundImage: `url(${background})` }}>
      <div className="panel-frame">
        <div className="panel-meta">
          <span className="pill muted">{scene.title}</span>
          <span className="pill">Шаг {step + 1} / {scene.steps.length}</span>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default SceneRenderer;
