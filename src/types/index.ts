import type {LucideIcon} from "lucide-react";

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type ThemeId = 'cyberpunk' | 'medieval' | 'space' | 'napoleon';
export type DifficultyId = 'tutorial' | 'novice' | 'casual' | 'expert';

export type GamePhase = 'select_character' | 'select_difficulty' | 'playing' | 'game_over';

export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    boardLight: string;
    boardDark: string;
    fontDisplay: string;
    fontBody: string;
    gradient: string;
    glow: string;
}

export interface CharacterPhrases {
    greeting: string[];
    capture: string[];
    captured: string[];
    check: string[];
    checkmateWin: string[];
    checkmateLose: string[];
    thinking: string[];
    tutorial: string[];
    goodMove: string[];
    badMove: string[];
}

export interface Character {
    id: ThemeId;
    name: string;
    title: string;
    icon: LucideIcon;
    phrases: CharacterPhrases;
    theme: Theme;
}

export interface DifficultyLevel {
    id: DifficultyId;
    label: string;
    icon: LucideIcon;
    description: string;
    depth: number;
}
