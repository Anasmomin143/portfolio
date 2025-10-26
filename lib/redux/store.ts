import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import experienceReducer from './slices/experienceSlice';
import skillsReducer from './slices/skillsSlice';
import certificationsReducer from './slices/certificationsSlice';
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      experience: experienceReducer,
      skills: skillsReducer,
      certifications: certificationsReducer,
      ui: uiReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
