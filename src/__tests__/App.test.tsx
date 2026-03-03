import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock react-chessboard
vi.mock('react-chessboard', () => ({
    Chessboard: () => <div data-testid="chessboard" />,
}));

// Mock engine
vi.mock('./engine/engine', () => ({
    getRandomPhrase: (phrases: string[]) => phrases[0],
}));

describe('App', () => {
    it('should render character selection on initial load', () => {
        render(<App />);
        expect(screen.getByText('ui.selectCharacter')).toBeDefined();
    });

    it('should render language toggle button', () => {
        render(<App />);
        expect(screen.getByText('FR')).toBeDefined();
    });

    it('should show difficulty selection after confirming character', () => {
        render(<App />);
        fireEvent.click(screen.getByText('N3ON'));
        fireEvent.click(screen.getByText('ui.next'));
        expect(screen.getByText('ui.selectDifficulty')).toBeDefined();
    });

    it('should go back to character selection from difficulty screen', () => {
        render(<App />);
        fireEvent.click(screen.getByText('N3ON'));
        fireEvent.click(screen.getByText('ui.next'));
        fireEvent.click(screen.getByText('←'));
        expect(screen.getByText('ui.selectCharacter')).toBeDefined();
    });

    it('should start game after selecting difficulty', () => {
        render(<App />);
        fireEvent.click(screen.getByText('N3ON'));
        fireEvent.click(screen.getByText('ui.next'));
        fireEvent.click(screen.getByText('ui.startGame'));
        expect(screen.getByTestId('chessboard')).toBeDefined();
    });
});
