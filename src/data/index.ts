import type {DifficultyId, Theme, ThemeId} from "../types";
import {BookOpen, Bot, Brain, Cpu, Crown, Dices, type LucideIcon, Swords, Wand2} from "lucide-react";

export interface CharacterData {
    id: ThemeId;
    name: string;
    icon: LucideIcon;
    theme: Theme;
}

export interface DifficultyData {
    id: DifficultyId;
    icon: LucideIcon;
    depth: number;
}

export const DIFFICULTY_LEVELS: DifficultyData[] = [
    { id: 'tutorial', icon: BookOpen, depth: 0 },
    { id: 'novice', icon: Dices, depth: 1 },
    { id: 'casual', icon: Brain, depth: 2 },
    { id: 'expert', icon: Swords, depth: 4 },
];

export const CHARACTERS: CharacterData[] = [
    {
        id: 'cyberpunk',
        name: 'N3ON',
        icon: Bot,
        theme: {
            primary: '#00fff0',
            secondary: '#ff00aa',
            accent: '#ffff00',
            background: '#050510',
            boardLight: '#0a1628',
            boardDark: '#050510',
            fontDisplay: 'Orbitron',
            fontBody: 'Share Tech Mono',
            gradient: 'linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)',
            glow: '0 0 20px #00fff0, 0 0 40px #ff00aa44',
        },
    },
    {
        id: 'medieval',
        name: 'Gandalf',
        icon: Wand2,
        theme: {
            primary: '#d4a843',
            secondary: '#8b4513',
            accent: '#e8c97e',
            background: '#1a0f00',
            boardLight: '#c8a97a',
            boardDark: '#4a2c00',
            fontDisplay: 'Cinzel',
            fontBody: 'Palatino Linotype',
            gradient: 'linear-gradient(135deg, #1a0f00 0%, #2d1a00 50%, #1a0f00 100%)',
            glow: '0 0 20px #d4a84388, 0 0 40px #8b451344',
        },
    },
    {
        id: 'space',
        name: 'HAL-9001',
        icon: Cpu,
        theme: {
            primary: '#4fc3f7',
            secondary: '#1a237e',
            accent: '#ff1744',
            background: '#000814',
            boardLight: '#0d1b2a',
            boardDark: '#000814',
            fontDisplay: 'Exo 2',
            fontBody: 'Rajdhani',
            gradient: 'radial-gradient(ellipse at center, #000d1a 0%, #000814 70%)',
            glow: '0 0 30px #4fc3f744, 0 0 60px #1a237e44',
        },
    },
    {
        id: 'napoleon',
        name: 'Napoléon',
        icon: Crown,
        theme: {
            primary: '#c9a84c',
            secondary: '#1a0a2e',
            accent: '#e63946',
            background: '#0d0820',
            boardLight: '#e8d5b0',
            boardDark: '#2c1810',
            fontDisplay: 'Cinzel Decorative',
            fontBody: 'Crimson Text',
            gradient: 'linear-gradient(160deg, #0d0820 0%, #1a0a2e 50%, #0d0820 100%)',
            glow: '0 0 25px #c9a84c66, 0 0 50px #e6394622',
        },
    },
];
