import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import * as authService from '../../services/authService';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

// Mock authService
jest.mock('../../services/authService');

describe('LoginScreen', () => {
  it('normalizes email input before logging in', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Enter user details with a messy email
    fireEvent.changeText(
      getByPlaceholderText('Email'),
      '  Test.User@Example.COM  '
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Mock the service function to resolve successfully
    (authService.logIn as jest.Mock).mockResolvedValue(undefined);

    // Press the login button
    fireEvent.press(getByTestId('loginButton'));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that logIn was called with the normalized email
      expect(authService.logIn).toHaveBeenCalledWith(
        'test.user@example.com',
        'password123'
      );
    });
  });
});
