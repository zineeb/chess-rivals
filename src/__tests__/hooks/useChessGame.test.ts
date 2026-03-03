import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChessGame } from '../../hooks/useChessGame';
import { CHARACTERS, DIFFICULTY_LEVELS } from '../../data';

describe('useChessGame', () => {
    describe('initial state', () => {
        it('should start in select_character phase', () => {
            const { result } = renderHook(() => useChessGame());
            expect(result.current.phase).toBe('select_character');
        });

        it('should have no selected square initially', () => {
            const { result } = renderHook(() => useChessGame());
            expect(result.current.selectedSquare).toBeNull();
        });

        it('should have no captured pieces initially', () => {
            const { result } = renderHook(() => useChessGame());
            expect(result.current.capturedByPlayer).toHaveLength(0);
            expect(result.current.capturedByAI).toHaveLength(0);
        });

        it('should not be thinking initially', () => {
            const { result } = renderHook(() => useChessGame());
            expect(result.current.isThinking).toBe(false);
        });
    });

    describe('startGame', () => {
        it('should switch to playing phase', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            expect(result.current.phase).toBe('playing');
        });

        it('should reset captured pieces on new game', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            expect(result.current.capturedByPlayer).toHaveLength(0);
            expect(result.current.capturedByAI).toHaveLength(0);
        });

        it('should reset selected square on new game', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            expect(result.current.selectedSquare).toBeNull();
        });
    });

    describe('resetGame', () => {
        it('should return to select_character phase', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            act(() => {
                result.current.resetGame();
            });
            expect(result.current.phase).toBe('select_character');
        });
    });

    describe('onSquareClick', () => {
        it('should not select a square when not in playing phase', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.onSquareClick('e2');
            });
            expect(result.current.selectedSquare).toBeNull();
        });

        it('should select a white piece on first click', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            act(() => {
                result.current.onSquareClick('e2');
            });
            expect(result.current.selectedSquare).toBe('e2');
        });

        it('should highlight legal moves after selecting a piece', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            act(() => {
                result.current.onSquareClick('e2');
            });
            expect(result.current.legalMoves).toContain('e3');
            expect(result.current.legalMoves).toContain('e4');
        });

        it('should deselect when clicking an illegal square', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.startGame(CHARACTERS[0], DIFFICULTY_LEVELS[0].id);
            });
            act(() => {
                result.current.onSquareClick('e2');
            });
            act(() => {
                result.current.onSquareClick('e5');
            });
            expect(result.current.selectedSquare).toBeNull();
        });
    });

    describe('showComment', () => {
        it('should set a comment', () => {
            const { result } = renderHook(() => useChessGame());
            act(() => {
                result.current.showComment('Test comment');
            });
            expect(result.current.comment).toBe('Test comment');
        });
    });
});
