import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QueryResult {
  query_id: string;
  matter_inferred: string;
  analysis: {
    laws: string[];
    forum: string;
    docs: string[];
    steps: string[];
    outcomes: string[];
    question: string;
    confidence_score: number;
    citations: string[];
    disclaimer: string;
  };
}

interface QueryState {
  activeQuery: QueryResult | null;
  history: QueryResult[];
}

const initialState: QueryState = {
  activeQuery: null,
  history: [],
};

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setActiveQuery: (state, action: PayloadAction<QueryResult>) => {
      state.activeQuery = action.payload;
      // Also add to history if not exists
      if (!state.history.find(q => q.query_id === action.payload.query_id)) {
        state.history.unshift(action.payload);
      }
    },
    clearActiveQuery: (state) => {
      state.activeQuery = null;
    },
    clearHistory: (state) => {
      state.history = [];
    }
  },
});

export const { setActiveQuery, clearActiveQuery, clearHistory } = querySlice.actions;
export default querySlice.reducer;
