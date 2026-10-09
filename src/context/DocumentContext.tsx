import React, { createContext, useContext, useState } from 'react';
import type { GeometryDocument } from '../geometry/GeometryDocument.ts';

type DocumentContextValue = {
  document: GeometryDocument;
  setDocument: React.Dispatch<React.SetStateAction<GeometryDocument>>;
};

const defaultDocument: GeometryDocument = {
  points: [],
  circles: [],
  lines: [],
};

const DocumentContext = createContext<DocumentContextValue | undefined>(
  undefined,
);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [document, setDocument] = useState<GeometryDocument>(defaultDocument);

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(DocumentContext);
  if (!ctx) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return ctx;
}
