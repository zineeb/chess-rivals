import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import type {DifficultyData} from '../../data';
import type {DifficultyId} from '../../types';

interface DifficultySelectProps {
    difficulties: DifficultyData[];
    selectedDifficulty: DifficultyId;
    onSelect: (difficulty: DifficultyId) => void;
    onConfirm: () => void;
    onBack: () => void;
}

export const DifficultySelect: FC<DifficultySelectProps> = ({difficulties, selectedDifficulty, onSelect, onConfirm, onBack}) => {
    const {t} = useTranslation();

    return (
        <div className="difficulty-select">
            <button className="difficulty-select__back" onClick={onBack}>
                ←
            </button>

            <h2 className="difficulty-select__title">
                {t('ui.selectDifficulty')}
            </h2>

            <div className="difficulty-select__grid">
                {difficulties.map((difficulty) => {
                    const Icon = difficulty.icon;
                    const isSelected = difficulty.id === selectedDifficulty;

                    return (
                        <button
                            key={difficulty.id}
                            className={`difficulty-card ${isSelected ? 'difficulty-card--selected' : ''}`}
                            onClick={() => onSelect(difficulty.id)}
                        >
                            <Icon className="difficulty-card__icon"/>
                            <span className="difficulty-card__label">
                {t(`difficulty.${difficulty.id}.label`)}
              </span>
                            <p className="difficulty-card__description">
                                {t(`difficulty.${difficulty.id}.description`)}
                            </p>
                        </button>
                    );
                })}
            </div>

            <button className="difficulty-select__confirm" onClick={onConfirm}>
                {t('ui.startGame')}
            </button>
        </div>
    );
};
