import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { CharacterData } from '../../data';

interface CharacterSelectProps {
    characters: CharacterData[];
    selectedCharacter: CharacterData | null;
    onSelect: (character: CharacterData) => void;
    onConfirm: () => void;
}

export const CharacterSelect: FC<CharacterSelectProps> = ({characters, selectedCharacter, onSelect, onConfirm}) => {
    const { t } = useTranslation();

    return (
        <div className="character-select">
            <h1 className="character-select__title">
                {t('ui.selectCharacter')}
            </h1>

            <div className="character-select__grid">
                {characters.map((character) => {
                    const Icon = character.icon;
                    const isSelected = selectedCharacter?.id === character.id;

                    return (
                        <button
                            key={character.id}
                            className={`character-card ${isSelected ? 'character-card--selected' : ''}`}
                            style={{ '--character-primary': character.theme.primary } as React.CSSProperties}
                            onClick={() => onSelect(character)}
                        >
                            <Icon className="character-card__icon" />
                            <span className="character-card__name">{character.name}</span>
                            <span className="character-card__title">
                {t(`characters.${character.id}.title`)}
              </span>
                            <p className="character-card__quote">
                                {t(`characters.${character.id}.phrases.greeting.0`)}
                            </p>
                        </button>
                    );
                })}
            </div>

            <button
                className="character-select__confirm"
                onClick={onConfirm}
                disabled={!selectedCharacter}
            >
                {t('ui.next')}
            </button>
        </div>
    );
};
