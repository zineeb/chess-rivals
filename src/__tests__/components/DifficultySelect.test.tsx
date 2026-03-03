import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DifficultySelect } from '../../components/DifficultySelect/DifficultySelect';
import { DIFFICULTY_LEVELS } from '../../data';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('DifficultySelect', () => {
    const defaultProps = {
        difficulties: DIFFICULTY_LEVELS,
        selectedDifficulty: DIFFICULTY_LEVELS[0].id,
        onSelect: vi.fn(),
        onConfirm: vi.fn(),
        onBack: vi.fn(),
    };

    it('should render all difficulty levels', () => {
        render(<DifficultySelect {...defaultProps} />);
        DIFFICULTY_LEVELS.forEach((difficulty) => {
            expect(screen.getByText(`difficulty.${difficulty.id}.label`)).toBeDefined();
        });
    });

    it('should call onSelect when a difficulty is clicked', () => {
        const onSelect = vi.fn();
        render(<DifficultySelect {...defaultProps} onSelect={onSelect} />);
        fireEvent.click(screen.getByText(`difficulty.${DIFFICULTY_LEVELS[1].id}.label`));
        expect(onSelect).toHaveBeenCalledWith(DIFFICULTY_LEVELS[1].id);
    });

    it('should call onConfirm when confirm button is clicked', () => {
        const onConfirm = vi.fn();
        render(<DifficultySelect {...defaultProps} onConfirm={onConfirm} />);
        fireEvent.click(screen.getByText('ui.startGame'));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('should call onBack when back button is clicked', () => {
        const onBack = vi.fn();
        render(<DifficultySelect {...defaultProps} onBack={onBack} />);
        fireEvent.click(screen.getByText('←'));
        expect(onBack).toHaveBeenCalled();
    });

    it('should apply selected class to the selected difficulty', () => {
        const { container } = render(<DifficultySelect {...defaultProps} />);
        const selectedCard = container.querySelector('.difficulty-card--selected');
        expect(selectedCard).not.toBeNull();
    });
});
