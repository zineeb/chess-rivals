import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterSelect } from '../../components/CharacterSelect/CharacterSelect';
import { CHARACTERS } from '../../data';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('CharacterSelect', () => {
    const defaultProps = {
        characters: CHARACTERS,
        selectedCharacter: null,
        onSelect: vi.fn(),
        onConfirm: vi.fn(),
    };

    it('should render all characters', () => {
        render(<CharacterSelect {...defaultProps} />);
        CHARACTERS.forEach((character) => {
            expect(screen.getByText(character.name)).toBeDefined();
        });
    });

    it('should call onSelect when a character is clicked', () => {
        const onSelect = vi.fn();
        render(<CharacterSelect {...defaultProps} onSelect={onSelect} />);
        fireEvent.click(screen.getByText(CHARACTERS[0].name));
        expect(onSelect).toHaveBeenCalledWith(CHARACTERS[0]);
    });

    it('should disable confirm button when no character is selected', () => {
        render(<CharacterSelect {...defaultProps} selectedCharacter={null} />);
        const confirmButton = screen.getByText('ui.next');
        expect(confirmButton).toHaveProperty('disabled', true);
    });

    it('should enable confirm button when a character is selected', () => {
        render(<CharacterSelect {...defaultProps} selectedCharacter={CHARACTERS[0]} />);
        const confirmButton = screen.getByText('ui.next');
        expect(confirmButton).toHaveProperty('disabled', false);
    });

    it('should call onConfirm when confirm button is clicked', () => {
        const onConfirm = vi.fn();
        render(
            <CharacterSelect
                {...defaultProps}
                selectedCharacter={CHARACTERS[0]}
                onConfirm={onConfirm}
            />
        );
        fireEvent.click(screen.getByText('ui.next'));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('should apply selected class to the selected character', () => {
        const { container } = render(
            <CharacterSelect {...defaultProps} selectedCharacter={CHARACTERS[0]} />
        );
        const selectedCard = container.querySelector('.character-card--selected');
        expect(selectedCard).not.toBeNull();
    });
});
