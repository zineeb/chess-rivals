import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { getBestMove } from '../../engine/ai';

describe('getBestMove', () => {
    it('should return a valid move for tutorial difficulty', () => {
        const game = new Chess();
        const move = getBestMove(game, 'tutorial');
        expect(game.moves()).toContain(move);
    });

    it('should return a valid move for novice difficulty', () => {
        const game = new Chess();
        const move = getBestMove(game, 'novice');
        expect(game.moves()).toContain(move);
    });

    it('should return a valid move for casual difficulty', () => {
        const game = new Chess();
        const move = getBestMove(game, 'casual');
        expect(game.moves()).toContain(move);
    });

    it('should return null when no moves are available', () => {
        // Stalemate position
        const game = new Chess('k7/8/1Q6/8/8/8/8/7K b - - 0 1');
        expect(getBestMove(game, 'novice')).toBeNull();
    });

    it('should find checkmate in one move', () => {
        const fen = '7k/6Q1/5K2/8/8/8/8/8 w - - 0 1';
        const game = new Chess(fen);

        const move = getBestMove(game, 'casual');

        const gameCopy = new Chess(fen);
        gameCopy.move(move!);

        expect(gameCopy.isCheckmate()).toBe(true);
    });
});
