import { Chess } from 'chess.js';
import type { DifficultyId } from '../types';
import { getBestMove } from './ai';

self.onmessage = (event: MessageEvent<{ fen: string; difficulty: DifficultyId }>) => {
    const { fen, difficulty } = event.data;
    const game = new Chess(fen);
    const bestMove = getBestMove(game, difficulty);
    self.postMessage({ bestMove });
};
