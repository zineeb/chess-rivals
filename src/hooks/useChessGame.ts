import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import type { CharacterData } from '../data';
import type { DifficultyId, GamePhase } from '../types';

interface ChessGameState {
    game: Chess;
    position: string;
    selectedSquare: string | null;
    legalMoves: string[];
    lastMove: { from: string; to: string } | null;
    isThinking: boolean;
    comment: string;
    phase: GamePhase;
    capturedByPlayer: string[];
    capturedByAI: string[];
}

interface UseChessGameReturn extends ChessGameState {
    onSquareClick: (square: string) => void;
    startGame: (character: CharacterData, difficulty: DifficultyId) => void;
    resetGame: () => void;
    showComment: (message: string, duration?: number) => void;
    goToDifficultySelect: () => void;
}

export function useChessGame(): UseChessGameReturn {
    const [game, setGame] = useState<Chess>(new Chess());
    const [position, setPosition] = useState<string>(new Chess().fen());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [phase, setPhase] = useState<GamePhase>('select_character');
    const [capturedByPlayer, setCapturedByPlayer] = useState<string[]>([]);
    const [capturedByAI, setCapturedByAI] = useState<string[]>([]);

    // Refs for values that don't need to trigger re-renders
    const workerRef = useRef<Worker | null>(null);
    const commentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const characterRef = useRef<CharacterData | null>(null);
    const difficultyRef = useRef<DifficultyId>('novice');

    /**
     * Initialize the Web Worker once on mount.
     * The worker handles AI move calculation in a separate thread
     * to prevent blocking the main UI thread.
     */
    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../engine/chessWorker.ts', import.meta.url),
            { type: 'module' }
        );

        // Handle AI move returned by the worker
        workerRef.current.onmessage = (event: MessageEvent<{ bestMove: string | null }>) => {
            const { bestMove } = event.data;
            if (!bestMove) return;

            setGame(prev => {
                const updated = new Chess(prev.fen());
                const result = updated.move(bestMove);

                if (result?.captured) {
                    setCapturedByAI(prevCaptured => [...prevCaptured, result.captured!]);
                }

                setLastMove({ from: result.from, to: result.to });
                setPosition(updated.fen());

                // Check for end of game after AI move
                if (updated.isCheckmate() || updated.isDraw()) {
                    setPhase('game_over');
                }

                return updated;
            });

            setIsThinking(false);
        };

        // Terminate the worker when the component unmounts
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    /**
     * Displays a character comment for a given duration.
     * Clears any previously scheduled comment before setting the new one.
     */
    const showComment = useCallback((message: string, duration = 5000) => {
        if (commentTimeoutRef.current) clearTimeout(commentTimeoutRef.current);
        setComment(message);
        commentTimeoutRef.current = setTimeout(() => setComment(''), duration);
    }, []);

    /**
     * Sends the current FEN position to the Web Worker
     * to compute the best AI move asynchronously.
     */
    const triggerAIMove = useCallback((fen: string) => {
        if (!workerRef.current) return;
        setIsThinking(true);
        workerRef.current.postMessage({
            fen,
            difficulty: difficultyRef.current,
        });
    }, []);

    /**
     * Handles square click events on the board.
     * - First click: selects a white piece and highlights legal moves
     * - Second click on a legal square: executes the move and triggers AI response
     * - Second click on an illegal square: deselects the piece
     */
    const onSquareClick = useCallback((square: string) => {
        if (isThinking || phase !== 'playing') return;

        setGame(prev => {
            // Only allow white to play
            if (prev.turn() !== 'w') return prev;

            if (selectedSquare) {
                if (legalMoves.includes(square)) {
                    const updated = new Chess(prev.fen());
                    const piece = updated.get(selectedSquare as Square);

                    // Auto-promote to queen for simplicity
                    const isPromotion = piece?.type === 'p' && (square[1] === '8' || square[1] === '1');

                    const result = updated.move({
                        from: selectedSquare as Square,
                        to: square as Square,
                        promotion: isPromotion ? 'q' : undefined,
                    });

                    if (result) {
                        if (result.captured) {
                            setCapturedByPlayer(prevCaptured => [...prevCaptured, result.captured!]);
                        }

                        setLastMove({ from: result.from, to: result.to });
                        setSelectedSquare(null);
                        setLegalMoves([]);
                        setPosition(updated.fen());

                        if (updated.isCheckmate() || updated.isDraw()) {
                            setPhase('game_over');
                            return updated;
                        }

                        // Trigger AI response after player move
                        triggerAIMove(updated.fen());
                        return updated;
                    }
                }

                // Deselect if click is not on a legal square
                setSelectedSquare(null);
                setLegalMoves([]);
                return prev;
            }

            // Select a white piece and compute its legal moves
            const piece = prev.get(square as Square);
            if (piece?.color === 'w') {
                const moves = prev.moves({ square: square as Square, verbose: true });
                setSelectedSquare(square);
                setLegalMoves(moves.map(m => m.to));
            }

            return prev;
        });
    }, [isThinking, phase, selectedSquare, legalMoves, triggerAIMove]);

    /**
     * Navigates to the difficulty selection phase.
     */
    const goToDifficultySelect = useCallback(() => {
        setPhase('select_difficulty');
    }, []);

    /**
     * Starts a new game with the selected character and difficulty.
     * Resets all game state and switches to the playing phase.
     */
    const startGame = useCallback((character: CharacterData, difficulty: DifficultyId) => {
        characterRef.current = character;
        difficultyRef.current = difficulty;

        const newGame = new Chess();
        setGame(newGame);
        setPosition(newGame.fen());
        setSelectedSquare(null);
        setLegalMoves([]);
        setLastMove(null);
        setCapturedByPlayer([]);
        setCapturedByAI([]);
        setComment('');
        setPhase('playing');
    }, []);

    /**
     * Resets the entire game state and returns to character selection.
     */
    const resetGame = useCallback(() => {
        setPhase('select_character');
        setGame(new Chess());
        setPosition(new Chess().fen());
        setSelectedSquare(null);
        setLegalMoves([]);
        setLastMove(null);
        setCapturedByPlayer([]);
        setCapturedByAI([]);
        setComment('');
    }, []);

    return {
        game,
        position,
        selectedSquare,
        legalMoves,
        lastMove,
        isThinking,
        comment,
        phase,
        capturedByPlayer,
        capturedByAI,
        onSquareClick,
        startGame,
        resetGame,
        showComment,
        goToDifficultySelect,
    };
}
