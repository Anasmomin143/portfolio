import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Skill {
  id: string;
  category: string;
  skill_name: string;
  proficiency_level: string;
  years_experience: number;
  display_order: number;
}

interface SkillsState {
  items: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      return data as Skill[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch skills');
    }
  }
);

export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skill: Omit<Skill, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create skill');
      }
      const data = await res.json();
      return data as Skill;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create skill');
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ id, ...skill }: Partial<Skill> & { id: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update skill');
      }
      const data = await res.json();
      return data as Skill;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update skill');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete skill');
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete skill');
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch skills
    builder.addCase(fetchSkills.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchSkills.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create skill
    builder.addCase(createSkill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSkill.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createSkill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update skill
    builder.addCase(updateSkill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSkill.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateSkill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete skill
    builder.addCase(deleteSkill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSkill.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteSkill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = skillsSlice.actions;
export default skillsSlice.reducer;
