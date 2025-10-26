import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddStudentScreen from '../AddStudentScreen';
import * as authService from '../../services/authService';
import * as firestoreService from '../../services/firestoreService';
import { Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

// Mock services
jest.mock('../../services/authService');
jest.mock('../../services/firestoreService');

describe('AddStudentScreen', () => {
  it('normalizes email input before creating a user', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AddStudentScreen navigation={mockNavigation} />
    );

    // Enter user details with a messy email
    fireEvent.changeText(getByPlaceholderText('Enter first name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Enter last name'), 'Doe');
    fireEvent.changeText(
      getByPlaceholderText('student@email.com'),
      '  John.Doe@Example.COM  '
    );
    fireEvent.changeText(getByPlaceholderText('Min. 6 characters'), 'password123');
    fireEvent.changeText(
      getByPlaceholderText('Enter initial case notes...'),
      'Test case history.'
    );

    // Mock the service functions to resolve successfully
    (authService.createAuthUser as jest.Mock).mockResolvedValue({
      user: { uid: '123' },
    });
    (firestoreService.createUserProfile as jest.Mock).mockResolvedValue(undefined);
    (firestoreService.addStudentDetails as jest.Mock).mockResolvedValue(undefined);

    // Press the save button
    fireEvent.press(getByText('Save Student'));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check that createAuthUser was called with the normalized email
      expect(authService.createAuthUser).toHaveBeenCalledWith(
        'john.doe@example.com',
        'password123'
      );

      // Check that createUserProfile was also called with the normalized email
      expect(firestoreService.createUserProfile).toHaveBeenCalledWith(
        '123',
        'john.doe@example.com',
        'John',
        'Doe',
        'student'
      );
    });
  });
});
