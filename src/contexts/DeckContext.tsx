"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Deck } from "@/lib/types";
import { USER_DECKS } from "@/lib/mock-data";

interface DeckContextType {
  decks: Deck[];
  getDeckById: (deckId: string) => Deck | undefined;
  addDeck: (deck: Deck) => void;
  updateDeck: (deck: Deck) => void;
  removeDeck: (deckId: string) => void;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this from a DB.
    // For this demo, we'll load from mock data or localStorage.
    try {
      const storedDecks = localStorage.getItem("mediFlashDecks");
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      } else {
        // Load initial mock decks if nothing is in storage
        setDecks(USER_DECKS);
      }
    } catch (error) {
      console.error("Failed to parse decks from localStorage", error);
      setDecks(USER_DECKS); // fallback to mock data
    }
  }, []);

  useEffect(() => {
    // Persist decks to localStorage whenever they change
    try {
        localStorage.setItem("mediFlashDecks", JSON.stringify(decks));
    } catch (error) {
        console.error("Failed to save decks to localStorage", error);
    }
  }, [decks]);

  const addDeck = (deck: Deck) => {
    setDecks(prevDecks => [...prevDecks, deck]);
  };

  const updateDeck = (updatedDeck: Deck) => {
    setDecks(prevDecks => prevDecks.map(deck => (deck.id === updatedDeck.id ? updatedDeck : deck)));
  };

  const removeDeck = (deckId: string) => {
    setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
  };
    
  const getDeckById = (deckId: string) => {
    return decks.find(d => d.id === deckId);
  }

  return (
    <DeckContext.Provider value={{ decks, getDeckById, addDeck, updateDeck, removeDeck }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDecks() {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error("useDecks must be used within a DeckProvider");
  }
  return context;
}
