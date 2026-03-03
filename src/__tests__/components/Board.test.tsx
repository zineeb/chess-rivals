import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Board } from '../../components/Board/Board';
import { CHARACTERS } from '../../data';

// Mock react-chessboard
vi.mock('react-chessboard', () => ({
    Chessboard: () => <div data-testid="chessboard" />,
}));

describe('Board', () => {
    const defaultProps = {
        position: 'start',
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        isThinking: false,
        character: CHARACTERS[0],
        onSquareClick: vi.fn(),
    };

    it('should render the chessboard', () => {
        const { getByTestId } = render(<Board {...defaultProps} />);
        expect(getByTestId('chessboard')).toBeDefined();
    });

    it('should apply thinking class when isThinking is true', () => {
        const { container } = render(<Board {...defaultProps} isThinking={true} />);
        expect(container.querySelector('.board--thinking')).not.toBeNull();
    });

    it('should not apply thinking class when isThinking is false', () => {
        const { container } = render(<Board {...defaultProps} isThinking={false} />);
        expect(container.querySelector('.board--thinking')).toBeNull();
    });

    it('should render without selected square', () => {
        const { container } = render(<Board {...defaultProps} selectedSquare={null} />);
        expect(container.firstChild).not.toBeNull();
    });

    it('should render with legal moves', () => {
        const { container } = render(
            <Board {...defaultProps} legalMoves={['e3', 'e4']} />
        );
        expect(container.firstChild).not.toBeNull();
    });

    it('should render with last move highlighted', () => {
        const { container } = render(
            <Board {...defaultProps} lastMove={{ from: 'e2', to: 'e4' }} />
        );
        expect(container.firstChild).not.toBeNull();
    });
});
