import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { evaluateBoard, shuffleArray } from '../../engine/engine';

describe('evaluateBoard', () => {
    it('should return 0 for the initial position', () => {
        const game = new Chess();
        expect(evaluateBoard(game)).toBe(0);
    });

    it('should return a positive score when white has more material', () => {
        // Position where black is missing a queen
        const game = new Chess('rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(evaluateBoard(game)).toBeGreaterThan(0);
    });

    it('should return a negative score when black has more material', () => {
        // Position where white is missing a queen
        const game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1');
        expect(evaluateBoard(game)).toBeLessThan(0);
    });
});

describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
        const array = [1, 2, 3, 4, 5];
        expect(shuffleArray(array).length).toBe(array.length);
    });

    it('should contain the same elements', () => {
        const array = [1, 2, 3, 4, 5];
        expect(shuffleArray(array).sort()).toEqual(array.sort());
    });

    it('should not mutate the original array', () => {
        const array = [1, 2, 3, 4, 5];
        const original = [...array];
        shuffleArray(array);
        expect(array).toEqual(original);
    });
});
