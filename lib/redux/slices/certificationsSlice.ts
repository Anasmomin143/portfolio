import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string;
  display_order: number;
}

interface CertificationsState {
  items: Certification[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificationsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCertifications = createAsyncThunk(
  'certifications/fetchCertifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/certifications');
      if (!res.ok) throw new Error('Failed to fetch certifications');
      const data = await res.json();
      return data as Certification[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch certifications');
    }
  }
);

export const createCertification = createAsyncThunk(
  'certifications/createCertification',
  async (certification: Omit<Certification, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certification),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create certification');
      }
      const data = await res.json();
      return data as Certification;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create certification');
    }
  }
);

export const updateCertification = createAsyncThunk(
  'certifications/updateCertification',
  async ({ id, ...certification }: Partial<Certification> & { id: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certification),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update certification');
      }
      const data = await res.json();
      return data as Certification;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update certification');
    }
  }
);

export const deleteCertification = createAsyncThunk(
  'certifications/deleteCertification',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete certification');
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete certification');
    }
  }
);

const certificationsSlice = createSlice({
  name: 'certifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch certifications
    builder.addCase(fetchCertifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCertifications.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchCertifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create certification
    builder.addCase(createCertification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCertification.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createCertification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update certification
    builder.addCase(updateCertification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCertification.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateCertification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete certification
    builder.addCase(deleteCertification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCertification.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(deleteCertification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = certificationsSlice.actions;
export default certificationsSlice.reducer;
