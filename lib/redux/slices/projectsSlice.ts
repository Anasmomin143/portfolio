import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  highlights: string[];
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  display_order: number;
}

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      return data as Project[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (project: Omit<Project, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }
      const data = await res.json();
      return data as Project;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, ...project }: Partial<Project> & { id: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }
      const data = await res.json();
      return data as Project;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create project
    builder.addCase(createProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update project
    builder.addCase(updateProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProject.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete project
    builder.addCase(deleteProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
