import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChessGame } from './hooks/useChessGame';
import { CharacterSelect } from './components/CharacterSelect/CharacterSelect';
import { DifficultySelect } from './components/DifficultySelect/DifficultySelect';
import { Board } from './components/Board/Board';
import { CommentBubble } from './components/CommentBubble/CommentBubble';
import { CHARACTERS, DIFFICULTY_LEVELS, type CharacterData } from './data';
import type { DifficultyId } from './types';
import { getRandomPhrase } from './engine/engine';

export default function App() {
    const { t, i18n } = useTranslation();
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('novice');

    const {
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
    } = useChessGame();

    const handleCharacterConfirm = () => {
        if (selectedCharacter) goToDifficultySelect();
    };

    const handleStartGame = () => {
        if (!selectedCharacter) return;
        startGame(selectedCharacter, selectedDifficulty);
        showComment(
            getRandomPhrase(
                t(`characters.${selectedCharacter.id}.phrases.greeting`, { returnObjects: true }) as string[]
            )
        );
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
    };

    return (
        <div
            className="app"
            style={selectedCharacter ? {
                '--primary': selectedCharacter.theme.primary,
                '--secondary': selectedCharacter.theme.secondary,
                '--accent': selectedCharacter.theme.accent,
                '--background': selectedCharacter.theme.background,
                background: selectedCharacter.theme.gradient,
                fontFamily: selectedCharacter.theme.fontBody,
            } as React.CSSProperties : undefined}
        >
            {/* Language toggle */}
            <button className="app__lang-toggle" onClick={toggleLanguage}>
                {i18n.language === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Character selection */}
            {phase === 'select_character' && (
                <CharacterSelect
                    characters={CHARACTERS}
                    selectedCharacter={selectedCharacter}
                    onSelect={setSelectedCharacter}
                    onConfirm={handleCharacterConfirm}
                />
            )}

            {/* Difficulty selection */}
            {phase === 'select_difficulty' && (
                <DifficultySelect
                    difficulties={DIFFICULTY_LEVELS}
                    selectedDifficulty={selectedDifficulty}
                    onSelect={setSelectedDifficulty}
                    onConfirm={handleStartGame}
                    onBack={() => resetGame()}
                />
            )}

            {/* Game */}
            {phase === 'playing' && selectedCharacter && (
                <div className="app__game">
                    <header className="app__header">
                        <button className="app__menu-btn" onClick={resetGame}>
                            {t('ui.backToMenu')}
                        </button>
                        <h1 className="app__title" style={{ fontFamily: selectedCharacter.theme.fontDisplay }}>
                            Chess Rivals
                        </h1>
                        <span className="app__difficulty">
              {t(`difficulty.${selectedDifficulty}.label`)}
            </span>
                    </header>

                    <div className="app__content">
                        {/* AI side */}
                        <aside className="app__sidebar">
                            {(() => {
                                const Icon = selectedCharacter.icon;
                                return <Icon className="app__character-icon" />;
                            })()}
                            <p className="app__character-name" style={{ color: selectedCharacter.theme.primary }}>
                                {selectedCharacter.name}
                            </p>
                            <CommentBubble comment={comment} isThinking={isThinking} />
                            <div className="app__captured">
                                <span>{t('ui.capturedByAI', { name: selectedCharacter.name })}</span>
                                <div className="app__captured-pieces">
                                    {capturedByAI.map((piece, index) => (
                                        <span key={index} className="app__piece">{piece}</span>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Board */}
                        <Board
                            position={position}
                            selectedSquare={selectedSquare}
                            legalMoves={legalMoves}
                            lastMove={lastMove}
                            isThinking={isThinking}
                            character={selectedCharacter}
                            onSquareClick={onSquareClick}
                        />

                        {/* Player side */}
                        <aside className="app__sidebar">
                            <p className="app__status" style={{ color: selectedCharacter.theme.primary }}>
                                {game.isCheck() ? t('ui.check') : isThinking ? t('ui.thinking') : t('ui.yourTurn')}
                            </p>
                            <div className="app__captured">
                                <span>{t('ui.capturedByPlayer')}</span>
                                <div className="app__captured-pieces">
                                    {capturedByPlayer.map((piece, index) => (
                                        <span key={index} className="app__piece">{piece}</span>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            )}

            {/* Game over */}
            {phase === 'game_over' && selectedCharacter && (
                <div className="app__game-over">
                    <h2 className="app__game-over-title" style={{ color: selectedCharacter.theme.primary }}>
                        {game.isCheckmate() && game.turn() === 'b' ? t('ui.victory') : game.isDraw() ? t('ui.draw') : t('ui.defeat')}
                    </h2>
                    <p className="app__game-over-comment">{comment}</p>
                    <div className="app__game-over-actions">
                        <button className="app__btn" onClick={handleStartGame}>
                            {t('ui.playAgain')}
                        </button>
                        <button className="app__btn" onClick={resetGame}>
                            {t('ui.backToMenu')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
