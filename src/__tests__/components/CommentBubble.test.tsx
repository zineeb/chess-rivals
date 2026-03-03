import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentBubble } from '../../components/CommentBubble/CommentBubble';

describe('CommentBubble', () => {
    it('should render nothing when no comment and not thinking', () => {
        const { container } = render(
            <CommentBubble comment="" isThinking={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render comment text when comment is provided', () => {
        render(<CommentBubble comment="Hello world" isThinking={false} />);
        expect(screen.getByText('Hello world')).toBeDefined();
    });

    it('should render loader when thinking', () => {
        const { container } = render(
            <CommentBubble comment="" isThinking={true} />
        );
        expect(container.firstChild).not.toBeNull();
    });

    it('should render loader instead of comment when thinking', () => {
        const { container } = render(
            <CommentBubble comment="Hello" isThinking={true} />
        );
        expect(screen.queryByText('Hello')).toBeNull();
        expect(container.firstChild).not.toBeNull();
    });
});
