import { Chess } from 'chess.js';

// Material value for each piece type (in centipawns)
const PIECE_VALUES: Record<string, number> = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000,
};

// Position bonus table for pawns — encourages advancement and center control
const PAWN_TABLE: number[] = [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
].flat();

// Position bonus table for knights — encourages central positioning
const KNIGHT_TABLE: number[] = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50],
].flat();

/**
 * Evaluates the board position from white's perspective.
 * Positive score favors white, negative score favors black.
 */
export function evaluateBoard(game: Chess): number {
    const board = game.board();
    let score = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue;

            const value = PIECE_VALUES[piece.type] ?? 0;

            // Mirror the table index for black pieces
            const tableIndex = piece.color === 'w'
                ? row * 8 + col
                : (7 - row) * 8 + col;

            let positionBonus = 0;
            if (piece.type === 'p') positionBonus = PAWN_TABLE[tableIndex];
            if (piece.type === 'n') positionBonus = KNIGHT_TABLE[tableIndex];

            // Add to score for white, subtract for black
            score += piece.color === 'w'
                ? value + positionBonus
                : -(value + positionBonus);
        }
    }

    return score;
}

/**
 * Returns a random phrase from the given array.
 */
export function getRandomPhrase(phrases: string[]): string {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Returns a shuffled copy of the given array.
 */
export function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}
