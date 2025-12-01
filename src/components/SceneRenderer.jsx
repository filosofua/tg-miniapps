import React, { useEffect, useMemo } from 'react';
import DialogueBox from './DialogueBox';
import ChoiceButtons from './ChoiceButtons';
import { images } from '../assets/images';

const StepWrapper = ({ children }) => <div className="stack gap">{children}</div>;

const StepControls = ({ onContinue, label = 'Далее' }) => (
  <div className="controls-row">
    <button className="primary" onClick={onContinue}>{label}</button>
  </div>
);

const StatBadges = ({ delta = {} }) => {
  const { fear = 0, investigation = 0, moral = 0, item } = delta;
  if (!fear && !investigation && !moral && !item) return null;
  return (
    <div className="choice-stats">
      {!!fear && <span className="pill">Fear {fear > 0 ? '+' : ''}{fear}</span>}
      {!!investigation && <span className="pill">Inv {investigation > 0 ? '+' : ''}{investigation}</span>}
      {!!moral && <span className="pill">Moral {moral > 0 ? '+' : ''}{moral}</span>}
      {item && <span className="pill">+ {item}</span>}
    </div>
  );
};

const SceneRenderer = ({ scene, stepIndex, onResolve, onFinish, player }) => {
  const step = useMemo(() => scene?.steps?.[stepIndex] || null, [scene, stepIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scene?.id, stepIndex]);

  if (!scene) return null;

  const handleContinue = (nextStep) => {
    onResolve({ advance: typeof nextStep === 'number' ? nextStep : stepIndex + 1 });
  };

  const resolveWithDelta = (delta, next) => {
    onResolve({ advance: typeof next === 'number' ? next : stepIndex + 1, delta });
  };

  const handleChoice = (option) => {
    if (option.nextScene) {
      onResolve({ nextScene: option.nextScene, delta: option });
      return;
    }
    resolveWithDelta(option, option.next ?? stepIndex + 1);
  };

  const background = images[scene.background] || images.city;

  return (
    <div className="scene-shell" style={{ backgroundImage: `url(${background})` }}>
      <div className="panel-frame">
        <div className="panel-meta">
          <div>
            <div className="pill muted">{scene.title}</div>
            <h2 className="panel-title">Комикс · Ashwood</h2>
          </div>
          <div className="pill">Шаг {stepIndex + 1} / {scene.steps.length}</div>
        </div>

        {!step && (
          <StepWrapper>
            <p className="dialogue-text">Шаг не найден. Вернись или начни заново.</p>
            <StepControls onContinue={() => onResolve({ nextScene: 'scene1' })} />
          </StepWrapper>
        )}

        {step && step.type === 'dialogue' && (
          <StepWrapper>
            <DialogueBox speaker={step.speaker} mood={step.mood} text={step.text} />
            <StepControls onContinue={() => handleContinue(step.next)} />
          </StepWrapper>
        )}

        {step && step.type === 'choice' && (
          <StepWrapper>
            <div className="choice-box">
              <p className="choice-text">{step.text}</p>
              <ChoiceButtons options={step.options} onChoose={handleChoice} />
            </div>
          </StepWrapper>
        )}

        {step && step.type === 'add_item' && (
          <StepWrapper>
            <DialogueBox speaker={step.speaker || 'Инвентарь'} text={step.text || 'Ты находишь предмет.'} />
            <StatBadges delta={{ item: step.item, fear: step.fear, investigation: step.investigation, moral: step.moral }} />
            <StepControls onContinue={() => resolveWithDelta({
              fear: step.fear,
              investigation: step.investigation,
              moral: step.moral,
              item: step.item,
            }, step.next)} />
          </StepWrapper>
        )}

        {step && step.type === 'stat' && (
          <StepWrapper>
            <DialogueBox speaker={step.speaker || 'Внутренний голос'} text={step.text} />
            <StatBadges delta={step} />
            <StepControls onContinue={() => resolveWithDelta(step, step.next)} />
          </StepWrapper>
        )}

        {step && step.type === 'transition' && (
          <StepWrapper>
            <DialogueBox speaker={step.speaker || 'Нарратор'} text={step.text} />
            <StepControls onContinue={() => onResolve({ nextScene: step.nextScene || scene.nextScene, delta: step })} />
          </StepWrapper>
        )}

        {step && step.type === 'finish' && (
          <StepWrapper>
            <DialogueBox speaker={step.speaker || 'Финал'} text={step.text} />
            <StepControls onContinue={() => onFinish(step.label || 'Finale')} label="Забрать награду" />
          </StepWrapper>
        )}

        <div className="shell-card subdued" style={{ marginTop: 12 }}>
          <div className="card-header">
            <h3>Досье игрока</h3>
            <p>Fear {player.fear} · Investigation {player.investigation} · Moral {player.moral}</p>
          </div>
          <p className="dialogue-text">Инвентарь: {player.inventory.length ? player.inventory.join(', ') : 'пусто'}</p>
        </div>
      </div>
    </div>
  );
};

export default SceneRenderer;
