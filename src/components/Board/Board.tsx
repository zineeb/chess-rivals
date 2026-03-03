import type { FC } from 'react';
import { Chessboard } from 'react-chessboard';
import type { SquareHandlerArgs } from 'react-chessboard';
import type { CharacterData } from '../../data';

interface BoardProps {
    position: string;
    selectedSquare: string | null;
    legalMoves: string[];
    lastMove: { from: string; to: string } | null;
    isThinking: boolean;
    character: CharacterData;
    onSquareClick: (square: string) => void;
}

export const Board: FC<BoardProps> = ({
                                          position,
                                          selectedSquare,
                                          legalMoves,
                                          lastMove,
                                          isThinking,
                                          character,
                                          onSquareClick,
                                      }) => {
    // Build square highlight styles based on game state
    const squareStyles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
        squareStyles[selectedSquare] = {
            backgroundColor: `${character.theme.primary}66`,
        };
    }

    legalMoves.forEach((square) => {
        squareStyles[square] = {
            backgroundColor: `${character.theme.accent}44`,
            borderRadius: '50%',
        };
    });

    if (lastMove) {
        squareStyles[lastMove.from] = {
            backgroundColor: `${character.theme.secondary}55`,
        };
        squareStyles[lastMove.to] = {
            backgroundColor: `${character.theme.secondary}55`,
        };
    }

    return (
        <div className={`board ${isThinking ? 'board--thinking' : ''}`}>
            <Chessboard
                options={{
                    position,
                    onSquareClick: ({ square }: SquareHandlerArgs) => onSquareClick(square),
                    squareStyles,
                    darkSquareStyle: { backgroundColor: character.theme.boardDark },
                    lightSquareStyle: { backgroundColor: character.theme.boardLight },
                    animationDurationInMs: 200,
                }}
            />
        </div>
    );
};
