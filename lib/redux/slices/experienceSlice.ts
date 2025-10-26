import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  display_order: number;
}

interface ExperienceState {
  items: Experience[];
  loading: boolean;
  error: string | null;
}

const initialState: ExperienceState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchExperience = createAsyncThunk(
  'experience/fetchExperience',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/experience');
      if (!res.ok) throw new Error('Failed to fetch experience');
      const data = await res.json();
      return data as Experience[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch experience');
    }
  }
);

export const createExperience = createAsyncThunk(
  'experience/createExperience',
  async (experience: Omit<Experience, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create experience');
      }
      const data = await res.json();
      return data as Experience;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create experience');
    }
  }
);

export const updateExperience = createAsyncThunk(
  'experience/updateExperience',
  async ({ id, ...experience }: Partial<Experience> & { id: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update experience');
      }
      const data = await res.json();
      return data as Experience;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update experience');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'experience/deleteExperience',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete experience');
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete experience');
    }
  }
);

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch experience
    builder.addCase(fetchExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExperience.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create experience
    builder.addCase(createExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createExperience.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update experience
    builder.addCase(updateExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExperience.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete experience
    builder.addCase(deleteExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteExperience.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = experienceSlice.actions;
export default experienceSlice.reducer;
