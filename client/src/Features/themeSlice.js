import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: localStorage.getItem('sonaThemeV2') === null ? true : localStorage.getItem('sonaThemeV2') === 'true',
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('sonaThemeV2', state.darkMode);
      document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    },
    setDarkMode: (state, action) => {
       state.darkMode = action.payload;
       localStorage.setItem('sonaThemeV2', state.darkMode);
       document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    }
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
