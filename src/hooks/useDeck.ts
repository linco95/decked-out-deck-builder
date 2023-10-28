import { create } from 'zustand';
import { Card } from '../types/Card';
import { persist } from 'zustand/middleware';

type Deck = Card[];

type DeckState = { deck: Deck };

type DeckAction = {
    addCard: (card: Card) => void;
    removeCard: (card: Card) => void;
    clearDeck: () => void;
};

type DeckStore = DeckState & DeckAction;

const maxDeckSize = 40 as const;
const deckIsFull = (deck: Deck): boolean => deck.length >= maxDeckSize;

const cardReachedLimit = (deck: Deck, card: Card): boolean =>
    deck.filter(({ name }) => name === card.name).length >= card.limit;

const removeElementAtIndex = <T>(arr: T[], iToRemove: number) =>
    arr.filter((_, i) => i !== iToRemove);

const useDeck = create<DeckStore>()(
    persist(
        (set) => ({
            deck: [],
            addCard: (card: Card) =>
                set((state: DeckStore) => {
                    if (
                        deckIsFull(state.deck) ||
                        cardReachedLimit(state.deck, card)
                    ) {
                        return {};
                    }

                    //Add card
                    return { deck: [...state.deck, card] };
                }),
            removeCard: (card: Card) =>
                set((state: DeckStore) => {
                    const indexToRemove = state.deck.indexOf(card);
                    return {
                        deck: removeElementAtIndex(state.deck, indexToRemove),
                    };
                }),
            clearDeck: () => set({ deck: [] }),
        }),
        { name: 'decked-out-builder-deck' }
    )
);

export default useDeck;
