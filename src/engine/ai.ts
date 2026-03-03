import { Chess } from 'chess.js';
import type { DifficultyId } from '../types';
import { evaluateBoard, shuffleArray } from './engine';

const RANDOM_DIFFICULTIES: DifficultyId[] = ['tutorial', 'novice'];

const DEPTH_BY_DIFFICULTY: Partial<Record<DifficultyId, number>> = {
    casual: 2,
    expert: 4,
};

function minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
): number {
    if (depth === 0 || game.isGameOver()) {
        if (game.isCheckmate()) return isMaximizing ? -Infinity : Infinity;
        if (game.isDraw()) return 0;
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of moves) {
            game.move(move);
            const score = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (const move of moves) {
            game.move(move);
            const score = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minScore;
    }
}

export function getBestMove(game: Chess, difficulty: DifficultyId): string | null {
    const moves = game.moves();
    if (!moves.length) return null;

    if (RANDOM_DIFFICULTIES.includes(difficulty)) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    const depth = DEPTH_BY_DIFFICULTY[difficulty] ?? 2;
    const isWhite = game.turn() === 'w';

    let bestMove: string | null = null;
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of shuffleArray(moves)) {
        game.move(move);
        // After playing the move, opponent plays — so isMaximizing flips
        const score = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
        game.undo();

        if (isWhite ? score > bestScore : score < bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}
